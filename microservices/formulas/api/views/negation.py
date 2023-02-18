import json
from django.http import JsonResponse
from rest_framework import status
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from ..repository import create_bulk_formula, get_formula_by_stage, execute_algorithm
from ..enums import Stage
from ..factory import create_normalizer_url_key, create_step_one_key, create_step_two_key, create_step_three_key


@method_decorator(csrf_exempt, name='dispatch')
class NegationNormalizer(View):

    async def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        stage = data.get('stage')
        stage_enum = Stage(stage)
        workspace_id = data.get('workspace_id')

        algorithm_url_key = create_normalizer_url_key(stage_enum)

        step_one_json_key = create_step_one_key(stage_enum, "json")
        step_two_json_key = create_step_two_key(stage_enum, "json")
        step_three_json_key = create_step_three_key(stage_enum, "json")

        step_one_string_key = create_step_one_key(stage_enum, "string")
        step_two_string_key = create_step_two_key(stage_enum, "string")
        step_three_string_key = create_step_three_key(stage_enum, "string")

        formulas = await get_formula_by_stage(stage, workspace_id)
        if not formulas:
            return JsonResponse({
                'message': "Error getting formulas",
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            })
        names = [formula.name for formula in formulas]

        result = await execute_algorithm(
            url_key = algorithm_url_key, 
            body = {
                'is_proof': data.get('is_proof'),
                'argument_json': [formula.formula_json for formula in formulas]
            }
        )
        if not result:
            return JsonResponse({
                'message': "Error occurred during Normalization procedures",
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            })

        step_one_json = result.get(step_one_json_key) or []
        step_one_string = result.get(step_one_string_key) or ''
        step_one_saved = await create_bulk_formula({
            'names': names, 
            'jsons': step_one_json, 
            'strings': step_one_string
        }, stage + 1, workspace_id)

        step_two_json = result.get(step_two_json_key) or []
        step_two_string = result.get(step_two_string_key) or ''
        step_two_saved = await create_bulk_formula({
            'names': names, 
            'jsons': step_two_json, 
            'strings': step_two_string
        }, stage + 2, workspace_id)

        step_three_json = result.get(step_three_json_key) or []
        step_three_string = result.get(step_three_string_key) or ''
        step_three_saved = await create_bulk_formula({
            'names': names, 
            'jsons': step_three_json, 
            'strings': step_three_string
        }, stage + 3, workspace_id)

        if step_one_saved and step_two_saved and step_three_saved:
            return JsonResponse({
                "results": {
                    step_one_string_key: step_one_string,
                    step_two_string_key: step_two_string,
                    step_three_string_key: step_three_string
                },
                "status": status.HTTP_200_OK
            })
        else:
            return JsonResponse({
                "message": "Failed to save sub steps",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR
            })
