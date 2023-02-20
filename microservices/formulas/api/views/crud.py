import json
import os
import uuid
import aiohttp
from datetime import datetime
from django.http import JsonResponse
from rest_framework import status
from django.views.generic import View
from asgiref.sync import sync_to_async
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from ..repository import get_formula_by_stage
from ..models import Formula
from ..serializers import FormulaSerializer
from ..enums import Stage

def get_formula(pk):
    try:
        return Formula.objects.get(pk=uuid.UUID(pk))
    except:
        return None


@method_decorator(csrf_exempt, name='dispatch')
class FormulaCrudAsync(View):
    serializer_class = FormulaSerializer

    async def transpile(self, formula_postfix):
        try:
            async with aiohttp.ClientSession() as session:
                transpiler_url = os.getenv('TRANSPILER_LAMBDA_URL')
                response = await session.post(
                    transpiler_url, json={
                        'formula_postfix': formula_postfix
                    }
                )
                result = await response.text()
                return json.loads(result)
        except Exception as e:
            return None
    
    async def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        formula_postfix = data.get('formula_postfix')
        result = await self.transpile(formula_postfix)
        if not result:
            return JsonResponse({
                'message': "Error Occurred during formula transpilation",
                'status': status.HTTP_400_BAD_REQUEST
            })

        formula_json = result.get('formula_json') or {}
        formula_result = result.get('formula_result') or ""
        
        transpiled = {
            'name': data.get('name'),
            'is_conclusion': data.get('is_conclusion'),
            'formula_postfix': formula_postfix,
            'formula_json': formula_json,
            'formula_result': formula_result,
            'stage': Stage.ORIGINAL.value,
            'workspace_id': data.get('workspace_id')
        }
        serializer = self.serializer_class(data=transpiled)
        
        if await sync_to_async(serializer.is_valid)():
            await sync_to_async(serializer.save)()

            return JsonResponse({
                'formula': serializer.data,
                'status': status.HTTP_200_OK
            })
        else:
            return JsonResponse({
                'message': serializer.errors,
                'status': status.HTTP_400_BAD_REQUEST
            })

    async def patch(self, request, pk):
        data = json.loads(request.body.decode('utf-8'))
        
        formula = await sync_to_async(get_formula)(pk)
        if formula == None:
            return JsonResponse({
                'message': f"Formula with Id: {pk} not found",
                'status': status.HTTP_400_BAD_REQUEST
            })

        updated_formula_postfix = data.get("formula_postfix")
        if updated_formula_postfix != formula.formula_postfix:
            result = await self.transpile(updated_formula_postfix)
            if not result:
                return JsonResponse({
                    'message': "Error Occurred during formula transpilation",
                    'status': status.HTTP_400_BAD_REQUEST
                })
            data['formula_json'] = result.get('formula_json') or {}
            data['formula_result'] = result.get('formula_result') or ""
            
        serializer = self.serializer_class(
            formula, data=data, partial=True)

        if await sync_to_async(serializer.is_valid)():
            serializer.validated_data['updated_at'] = datetime.now()
            await sync_to_async(serializer.save)()
            
            return JsonResponse({
                'formula': serializer.data,
                'status': status.HTTP_200_OK
            })
        else:
            return JsonResponse({
                'message': serializer.errors,
                'status': status.HTTP_400_BAD_REQUEST
            })


@method_decorator(csrf_exempt, name='dispatch')
class FormulaCrudSync(View):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def get(self, request):
        workspace_id = request.GET.get('workspace_id')
        stage = request.GET.get('stage')

        formulas = get_formula_by_stage(stage, workspace_id)
        serializer = self.serializer_class(formulas, many=True)
        return JsonResponse({
            'formulas': serializer.data,
            'status': status.HTTP_200_OK
        })

    def delete(self, request, pk):
        formula = get_formula(pk)
        if formula == None:
            return JsonResponse({
                'message': f"Formula with Id: {pk} not found",
                'status': status.HTTP_400_BAD_REQUEST
            })

        formula.delete()
        return JsonResponse({
            'status': status.HTTP_200_OK
        })
