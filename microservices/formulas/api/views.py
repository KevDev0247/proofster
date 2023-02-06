from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import status, generics
from api.models import Formula
from api.serializers import FormulaSerializer
from datetime import datetime


class Formulas(generics.GenericAPIView):
    serializer_class = FormulaSerializer
    queryset = Formula.objects.all()

    async def transpile(formula_raw):
        pass

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

    def post(self, request):
        print(request.data.get("name"))
        transpiled = {
            "name": request.data.get("name"),
            "is_conclusion": request.data.get("is_conclusion"), 
            "formula_json": "a",
            "formula_result": "a",
            "workspace_id": request.data.get("workspace_id")
        }
        print(transpiled)
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
