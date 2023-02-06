from django.urls import path
from api.views import Formulas, FormulaAsync, FormulaDetail

urlpatterns = [
    path('', FormulaAsync.as_view()),
    path('<str:workspace_id>', Formulas.as_view()),
    path('<str:pk>', FormulaDetail.as_view())
]