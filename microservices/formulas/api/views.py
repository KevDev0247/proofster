import json
import os
import aiohttp
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status, generics
from api.models import Formula
from api.serializers import FormulaSerializer
from django.views.generic import View
from asgiref.sync import sync_to_async


class FormulaAsync(View):
    serializer_class = FormulaSerializer

    async def transpile(self, formula_raw):
        try:
            async with aiohttp.ClientSession() as session:
                transpiler_url = os.getenv("TRANSPILER_LAMBDA_URL")
                response = await session.get(f"{transpiler_url}?formula_raw={formula_raw}")
                result = await response.text()
                result = json.loads(result)
                return result
        except Exception as e:
            return None
    
    async def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        result = await self.transpile(data.get("formula_raw"))
        if not result:
            return Response(
                {
                    "status": "fail", 
                    "message": "Error Occurred during formula transpilation"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

        formula_json = result.get("formula_json") or {}
        formula_result = result.get("formula_result") or ""
        
        transpiled = {
            "name": data.get("name"),
            "is_conclusion": data.get("is_conclusion"), 
            "formula_json": formula_json,
            "formula_result": formula_result,
            "workspace_id": data.get("workspace_id")
        }
        serializer = self.serializer_class(data=transpiled)
        
        if await sync_to_async(serializer.is_valid)():
            await sync_to_async(serializer.save)()
            return JsonResponse(
                {
                    "status": "success", 
                    "formula": serializer.data,
                    "status": status.HTTP_201_CREATED
                }
            )
        else:
            return JsonResponse(
                {
                    "status": "fail", 
                    "message": serializer.errors,
                    "status": status.HTTP_400_BAD_REQUEST
                }
            )


class Formulas(generics.GenericAPIView):
    serializer_class = FormulaSerializer

    def get(self, workspace_id):
        formulas = Formula.objects.all()

        if workspace_id:
            formulas = formulas.filter(workspace_id=workspace_id)
        serializer = self.serializer_class(formulas, many=True)
        return Response({
            "status": "success",
            "formulas": serializer.data
        })


class FormulaDetail(generics.GenericAPIView):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def get_formula(self, pk):
        try:
            return Formula.objects.get(pk=pk)
        except:
            return None

    def patch(self, pk):
        formula = self.get_formula(pk=pk)
        if formula == None:
            return Response(
                {
                    "status": "fail",
                    "message": f"Formula with Id: {pk} not found",
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.serializer_class(formula)
        return Response({
            "status": "success",
            "formula": serializer.data
        })

    def delete(self, pk):
        formula = self.get_formula(pk)
        if formula == None:
            return Response(
                {
                    "status": "fail",
                    "message": f"Formula with Id: {pk} not found",
                },
                status=status.HTTP_404_NOT_FOUND
            )

        formula.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
