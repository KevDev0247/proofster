import json
from datetime import datetime
from rest_framework import status
from django.http import JsonResponse
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from api.service import (
    get_formula, 
    get_formula_by_workspace,
    sync_formulas_across_service
)
from api.serializers import FormulaSerializer

from dotenv import load_dotenv
load_dotenv()

        
@method_decorator(csrf_exempt, name='dispatch')
class Formulas(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        formula = {
            'name': data.get('name'),
            'description': data.get('description'),
            'workspace_id': data.get('workspace_id'),
            'is_conclusion': data.get('is_conclusion'),
            'formula_input': data.get('formula_input'),
            'input_mode': data.get('input_mode')
        }
        serializer = FormulaSerializer(data=formula)
        if serializer.is_valid():
            serializer.save()
        else:
            return JsonResponse({
                'message': serializer.errors,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        sync_formulas_across_service(
            data.get('workspace_id')
        )

        return JsonResponse({
            'formula': serializer.data,
        }, status=status.HTTP_200_OK)
    
    def get(self, request):
        workspace_id = request.GET.get('workspace_id')
        formulas = get_formula_by_workspace(workspace_id)
            
        serializer = FormulaSerializer(
            formulas,
            many=True
        )
        return JsonResponse({
            'formulas': serializer.data,
        }, status=status.HTTP_200_OK)    

@method_decorator(csrf_exempt, name='dispatch')
class FormulaDetail(View):
    
    def patch(self, request, pk):
        data = json.loads(request.body.decode('utf-8'))

        formula = get_formula(pk)
        if formula == None:
            return JsonResponse({
                'message': f"Formula with Id: {pk} not found",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        input_edited = data['formula_input'] != formula.formula_input
        type_edited = data['is_conclusion'] != formula.is_conclusion
        
        serializer = FormulaSerializer(
            instance=formula, 
            data=data,
            partial=True
        )
        if serializer.is_valid():
            serializer.validated_data['updated_at'] = datetime.now()
            serializer.save()

            print(input_edited, type_edited)
            if input_edited or type_edited:
                sync_formulas_across_service(
                    data.get('workspace_id')
                )

            return JsonResponse({
                'formula': serializer.data,
            }, status=status.HTTP_200_OK)
        else:
            return JsonResponse({
                'message': serializer.errors,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        formula = get_formula(pk)
        if formula == None:
            return JsonResponse({
                'message': f"Formula with Id: {pk} not found",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        workspace_id = formula.workspace_id
        
        formula.delete()
        sync_formulas_across_service(workspace_id)

        return JsonResponse({}, status=status.HTTP_200_OK)
