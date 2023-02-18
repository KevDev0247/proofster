import json
from datetime import datetime
from django.http import JsonResponse
from rest_framework import status
from django.views.generic import View
from asgiref.sync import sync_to_async
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from ..repository import create_bulk_formula, get_formula_by_stage, execute_algorithm
from ..models import Formula
from ..enums import Stage


@method_decorator(csrf_exempt, name='dispatch')
class PrenexNormalizer(View):

    async def post(self, request):
        result = await execute_algorithm(
            'CONJUNCTIVE_NORMALIZER_LAMBDA_URL', 
            json.loads(request.body.decode('utf-8'))
        )
        if not result:
            return JsonResponse({
                'message': "Error Occurred during Conjunctive Normalization procedure",
                'status': status.HTTP_400_BAD_REQUEST
            })

        dropped_quantifiers_json = result.get('dropped_quantifiers_json') or {}
        dropped_quantifiers_string = result.get('dropped_quantifiers_string') or ""

        cnf_json = result.get('cnf_json') or {}
        cnf_string = result.get('cnf_string') or ""

        clauses_json = result.get('clauses_json') or {}
        clauses_string = result.get('clauses_string') or ""