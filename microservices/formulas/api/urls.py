from django.urls import path
from api.views import Formulas, FormulaAsync, FormulaDetail
from asgiref.sync import async_to_sync

urlpatterns = [
    path('', async_to_sync(FormulaAsync.as_view)),
    path('<str:workspace_id>', Formulas.as_view()),
    path('<str:pk>', FormulaDetail.as_view())
]