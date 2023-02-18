import json
from datetime import datetime
from django.http import JsonResponse
from rest_framework import status
from django.views.generic import View
from asgiref.sync import sync_to_async
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from ..repository import create_bulk_formula, get_formula_by_stage, execute_algorithm
from ..enums import Stage


@method_decorator(csrf_exempt, name='dispatch')
class NegationNormalizer(View):

    async def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        stage = data.get('stage')
        workspace_id = data.get('workspace_id')

        formulas = await get_formula_by_stage(stage-1, workspace_id)
        if not formulas:
            return JsonResponse({
                'message': "Error getting formulas",
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            })
        names = [formula.name for formula in formulas]

        result = await execute_algorithm(
            'NEGATION_NORMALIZER_LAMBDA_URL', 
            {
                'is_proof': data.get('is_proof'),
                'argument_json': [formula.formula_json for formula in formulas]
            }
        )
        if not result:
            return JsonResponse({
                'message': "Error occurred during Negation Normalization procedure",
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            })

        negated_conclusion_json = result.get('negated_conclusion_json') or []
        negated_conclusion_string = result.get('negated_conclusion_string') or ""
        negated_conclusion_created = await create_bulk_formula({
            'names': names, 
            'jsons': negated_conclusion_json, 
            'strings': negated_conclusion_string
        }, Stage.NEGATED_CONCLUSION.value, workspace_id)

        removed_arrow_json = result.get('removed_arrow_json') or []
        removed_arrow_string = result.get('removed_arrow_string') or ""
        removed_arrow_created = await create_bulk_formula({
            'names': names, 
            'jsons': removed_arrow_json, 
            'strings': removed_arrow_string
        }, Stage.REMOVED_ARROW.value, workspace_id)
        
        nnf_json = result.get('nnf_json') or []
        nnf_string = result.get('nnf_string') or ""
        nnf_created = await create_bulk_formula({
            'names': names, 
            'jsons': nnf_json, 
            'strings': nnf_string
        }, Stage.NNF.value, workspace_id)

        if negated_conclusion_created and removed_arrow_created and nnf_created:
            return JsonResponse({
                "results": {
                    'negated_conclusion_string': negated_conclusion_string,
                    'removed_arrow_string': removed_arrow_string,
                    'nnf_string': nnf_string
                },
                "status": status.HTTP_200_OK
            })
        else:
            return JsonResponse({
                "message": "Failed to save sub steps",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR
            })
