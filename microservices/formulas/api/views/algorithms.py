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
from ..models import Formula
from ..serializers import FormulaSerializer
from ..enums import Stage

@method_decorator(csrf_exempt, name='dispatch')
class FormulaAlgorithmsAsync(View):
    serializer_class = FormulaSerializer

    async def handle_domain_request(self, url_key, body):
        try:
            async with aiohttp.ClientSession() as session:
                url = os.getenv(url_key)
                response = await session.post(
                    url, json={body}
                )
                result = await response.text()
                return json.loads(result)
        except Exception as e:
            return None

    async def generate_nnf(self, request):
        result = await self.handle_domain_request(
            'NEGATION_NORMALIZER_LAMBDA_URL', 
            json.loads(request.body.decode('utf-8'))
        )
        if not result:
            return JsonResponse({
                "message": "Error Occurred during Negation Normalization procedure",
                "status": status.HTTP_400_BAD_REQUEST
            })
        
        negated_conclusion_json = result.get("negated_conclusion_json") or {}
        negated_conclusion_string = result.get("negated_conclusion_string") or ""

        removed_arrow_json = result.get("removed_arrow_json") or {}
        removed_arrow_string = result.get("removed_arrow_string") or ""

        nnf_json = result.get("nnf_json") or {}
        nnf_string = result.get("nnf_string") or ""

    async def generate_pnf(self, request):
        result = await self.handle_domain_request(
            'PRENEX_NORMALIZER_LAMBDA_URL', 
            json.loads(request.body.decode('utf-8'))
        )
        if not result:
            return JsonResponse({
                "message": "Error Occurred during Prenex Normalization procedure",
                "status": status.HTTP_400_BAD_REQUEST
            })

    async def generate_cnf(self, request):
        result = await self.handle_domain_request(
            'CONJUNCTIVE_NORMALIZER_LAMBDA_URL', 
            json.loads(request.body.decode('utf-8'))
        )
        if not result:
            return JsonResponse({
                "message": "Error Occurred during Conjunctive Normalization procedure",
                "status": status.HTTP_400_BAD_REQUEST
            })