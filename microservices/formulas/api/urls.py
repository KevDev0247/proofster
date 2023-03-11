from django.urls import path
from api.views.crud import Formulas, FormulaDetail
from api.views.normalization import NormalizationSync, NormalizationAsync

urlpatterns = [
    # path('create/', FormulaCrudAsync.as_view(), name='post'),
    # path('update/<str:pk>', FormulaCrudAsync.as_view(), name='patch'),
    # path('get/', FormulaCrudSync.as_view(), name='get'),
    # path('delete/<str:pk>', FormulaCrudSync.as_view(), name='delete'),

    # path('domain/normalize', NormalizationAsync.as_view(), name='normalize'),
    # path('domain/results', NormalizationSync.as_view(), name='results')    
    
    path('create/', Formulas.as_view(), name='post'),
    path('get/', Formulas.as_view(), name='get'),
    path('update/<str:pk>', FormulaDetail.as_view(), name='patch'),
    path('delete/<str:pk>', FormulaDetail.as_view(), name='delete'),
]
