import pika
import json
import os
import aiohttp
from datetime import datetime
from django.http import JsonResponse
from rest_framework import status
from django.views.generic import View
from asgiref.sync import sync_to_async
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from api.service import (
    get_formula_by_stage, 
    get_formula, 
    get_formula_by_workspace,
    sync_formulas
)
from api.serializers import FormulaSerializer, FormulaLegacySerializer
from api.enums import Stage

from dotenv import load_dotenv
load_dotenv()


@method_decorator(csrf_exempt, name='dispatch')
class FormulaCrudAsync(View):

    async def transpile(self, formula_infix):
        try:
            async with aiohttp.ClientSession() as session:
                transpiler_url = os.getenv('TRANSPILER_LAMBDA_URL')
                response = await session.post(
                    transpiler_url, json={
                        'formula_infix': formula_infix
                    }
                )
                result = await response.text()
                return json.loads(result)
        except Exception as e:
            print(e)
            return None
    
    async def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        formula_infix = data.get('formula_infix')
        result = await self.transpile(formula_infix)
        if not result:
            return JsonResponse({
                'message': "Error Occurred during formula transpilation",
                'status': status.HTTP_400_BAD_REQUEST
            })

        formula_json = result.get('formula_json') or {}
        formula_result = result.get('formula_result') or ""
        formula_postfix = result.get('formula_postfix') or ""
        
        transpiled = {
            'name': data.get('name'),
            'is_conclusion': data.get('is_conclusion'),
            'formula_infix': formula_infix,
            'formula_postfix': formula_postfix,
            'formula_json': formula_json,
            'formula_result': formula_result,
            'stage': Stage.ORIGINAL.value,
            'workspace_id': data.get('workspace_id')
        }
        serializer = FormulaLegacySerializer(data=transpiled)
        
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

        updated_formula_infix = data.get("formula_infix")
        if updated_formula_infix != formula.formula_infix:
            result = await self.transpile(updated_formula_infix)
            if not result:
                return JsonResponse({
                    'message': "Error occurred during formula transpilation",
                    'status': status.HTTP_400_BAD_REQUEST
                })
            data['formula_json'] = result.get('formula_json') or {}
            data['formula_postfix'] = result.get('formula_postfix') or ""
            data['formula_result'] = result.get('formula_result') or ""
            
        serializer = FormulaLegacySerializer(
            instance=formula, 
            data=data, 
            partial=True
        )
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
class Formulas(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        formula = {
            'name': data.get('name'),
            'description': data.get('description'),
            'workspace_id': data.get('workspace_id'),
            'is_conclusion': data.get('is_conclusion'),
            'formula_infix': data.get('formula_infix')
        }
        serializer = FormulaSerializer(data=formula)
        if serializer.is_valid():
            serializer.save()
        else:
            return JsonResponse({
                'message': serializer.errors,
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            })
        
        sync_formulas(data.get('workspace_id'))

        return JsonResponse({
            'formula': serializer.data,
            'status': status.HTTP_200_OK
        })
    
    def get(self, request, pk):
        workspace_id = request.GET.get('workspace_id')
        formulas = get_formula_by_workspace(workspace_id)
            
        return JsonResponse({
            'formulas': formulas,
            'status': status.HTTP_200_OK
        })    

@method_decorator(csrf_exempt, name='dispatch')
class FormulaDetail(View):
    
    def patch(self, request, pk):
        data = json.loads(request.body.decode('utf-8'))

        formula = get_formula(pk)
        if formula == None:
            return JsonResponse({
                'message': f"Formula with Id: {pk} not found",
                'status': status.HTTP_400_BAD_REQUEST
            })
        
        serializer = FormulaSerializer(
            instance=formula, 
            data=data,
            partial=True
        )
        if serializer.is_valid():
            serializer.validated_data['updated_at'] = datetime.now()
            serializer.save()

            sync_formulas(data.get('workspace_id'))

            return JsonResponse({
                'formula': serializer.data,
                'status': status.HTTP_200_OK
            })
        else:
            return JsonResponse({
                'message': serializer.errors,
                'status': status.HTTP_400_BAD_REQUEST
            })

    def delete(self, request, pk):
        formula = get_formula(pk)
        if formula == None:
            return JsonResponse({
                'message': f"Formula with Id: {pk} not found",
                'status': status.HTTP_400_BAD_REQUEST
            })
        workspace_id = formula.workspace_id
        
        formula.delete()
        sync_formulas(workspace_id)

        return JsonResponse({
            'status': status.HTTP_200_OK
        })
