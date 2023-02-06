from django.urls import path
from api.views import Formulas, FormulaDetail

urlpatterns = [
    path('', Formulas.as_view()),
    path('<str:pk>', FormulaDetail.as_view())
]