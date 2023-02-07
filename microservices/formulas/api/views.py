import asyncio
import json
import aiohttp
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import status, generics
from api.models import Formula
from api.serializers import FormulaSerializer
from django.utils.decorators import classonlymethod
from datetime import datetime


class Formulas(generics.GenericAPIView):
    serializer_class = FormulaSerializer

    def get(self, request):
        workspace_id = request.GET.get("workspace_id")
        formulas = Formula.objects.all()

        if workspace_id:
            formulas = formulas.filter(workspace_id=workspace_id)
        serializer = self.serializer_class(formulas, many=True)
        return Response({
            "status": "success",
            "formulas": serializer.data
        })


class FormulaAsync(generics.GenericAPIView):

    @classonlymethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view._is_coroutine = asyncio.coroutines._is_coroutine
        return view

    async def transpile(formula_raw):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"https://jtnjwf86j2.execute-api.us-east-2.amazonaws.com/test/?formula_raw={formula_raw}") as response:
                    result = await response.text()
                    result = json.loads(result)
                    return result
        except Exception as e:
            return None

    async def post(self, request):
        print(request.data)
        result = await self.transpile(request.data.get("formula_raw"))
        if not result:
            return Response(
                {
                    "status": "fail", 
                    "message": "Error Occurred during formula transpilation"
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )

        formula_json = result.get("body").get("formula_json") or {}
        formula_result = result.get("body").get("formula_result") or ""
        
        transpiled = {
            "name": request.data.get("name"),
            "is_conclusion": request.data.get("is_conclusion"), 
            "formula_json": formula_json,
            "formula_result": formula_result,
            "workspace_id": request.data.get("workspace_id")
        }
        serializer = self.serializer_class(data=transpiled)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success", 
                    "formula": serializer.data
                }, 
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {
                    "status": "fail", 
                    "message": serializer.errors
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )


class FormulaDetail(generics.GenericAPIView):
    queryset = Formula.objects.all()
    serializer_class = FormulaSerializer

    def get_formula(self, pk):
        try:
            return Formula.objects.get(pk=pk)
        except:
            return None

    def patch(self, request, pk):
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

    def delete(self, request, pk):
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
