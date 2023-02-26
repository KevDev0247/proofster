import json
from django.http import JsonResponse
from rest_framework import status
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import sync_to_async

from ..enums import Stage
from ..repository import (
    get_formula_by_workspace,
    save_bulk_formula,
    get_formula_by_stage,
    execute_algorithm
)
from ..factory import (
    create_normalizer_url_key,
    create_step_one_key,
    create_step_two_key,
    create_step_three_key,
    create_normalization_results
)


@method_decorator(csrf_exempt, name='dispatch')
class NormalizationSync(View):

    def get(self, request):
        workspace_id = request.GET.get('workspace_id')
        stage = request.GET.get('stage')

        formulas = []
        if stage is None:
            formulas = get_formula_by_workspace(workspace_id)
        else:
            formulas = get_formula_by_stage(stage, workspace_id)

        return JsonResponse({
            'results': create_normalization_results(formulas),
            'status': status.HTTP_200_OK
        })


@method_decorator(csrf_exempt, name='dispatch')
class NormalizationAsync(View):

    async def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        stage = data.get('stage')
        stage_enum = Stage(stage)
        workspace_id = data.get('workspace_id')
        is_proof = data.get('is_proof')

        algorithm_url_key = create_normalizer_url_key(stage_enum)

        step_one_json_key = create_step_one_key(stage_enum, 'json')
        step_two_json_key = create_step_two_key(stage_enum, 'json')
        step_three_json_key = create_step_three_key(stage_enum, 'json')

        step_one_string_key = create_step_one_key(stage_enum, 'string')
        step_two_string_key = create_step_two_key(stage_enum, 'string')
        step_three_string_key = create_step_three_key(stage_enum, 'string')

        formulas = await sync_to_async(get_formula_by_stage)(stage, workspace_id)
        if not formulas:
            return JsonResponse({
                'message': "Error getting formulas from the database"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        premises, conclusion = [], []
        for formula in formulas:
            if formula.is_conclusion:
                conclusion.append(formula)
            else:
                premises.append(formula)
        argument = premises + conclusion

        result = await execute_algorithm(
            url_key=algorithm_url_key,
            body={
                'is_proof': is_proof,
                'argument_json': [formula.formula_json for formula in argument]
            }
        )
        if not result:
            return JsonResponse({
                'message': "Error occurred during Normalization procedures"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if len(conclusion) == 0 and is_proof:
            return JsonResponse({
                'message': "No conclusion was provided for proof preprocessing"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        names = [formula.name for formula in argument]
        ids = [formula.formula_id for formula in argument]
        conclusion_id = "" if len(
            conclusion) == 0 else conclusion[0].formula_id

        step_one_json = result.get(step_one_json_key) or []
        step_one_string = result.get(step_one_string_key) or ''
        step_one_saved = await save_bulk_formula(
            stage + 1,
            workspace_id,
            conclusion_id,
            names,
            ids,
            step_one_json,
            step_one_string
        )
        step_two_json = result.get(step_two_json_key) or []
        step_two_string = result.get(step_two_string_key) or ''
        step_two_saved = await save_bulk_formula(
            stage + 2,
            workspace_id,
            conclusion_id,
            names,
            ids,
            step_two_json,
            step_two_string
        )
        step_three_json = result.get(step_three_json_key) or []
        step_three_string = result.get(step_three_string_key) or ''
        step_three_saved = await save_bulk_formula(
            stage + 3,
            workspace_id,
            conclusion_id,
            names,
            ids,
            step_three_json,
            step_three_string
        )

        if step_one_saved and step_two_saved and step_three_saved:
            return JsonResponse({
                'results': {
                    step_one_string_key: step_one_string,
                    step_two_string_key: step_two_string,
                    step_three_string_key: step_three_string
                },
                'status': status.HTTP_200_OK
            })
        else:
            return JsonResponse({
                'message': "Error saving sub steps of normalization to database"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
