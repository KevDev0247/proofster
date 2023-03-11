from django.urls import path
from api.views import Formulas, FormulaDetail

urlpatterns = [
    path('create/', Formulas.as_view(), name='post'),
    path('get/', Formulas.as_view(), name='get'),
    path('update/<str:pk>', FormulaDetail.as_view(), name='patch'),
    path('delete/<str:pk>', FormulaDetail.as_view(), name='delete'),
]
