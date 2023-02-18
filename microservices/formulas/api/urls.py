from django.urls import path
from api.views.crud import FormulaCrudSync, FormulaCrudAsync
from api.views.negation import NegationNormalizer

urlpatterns = [
    path('create/', FormulaCrudAsync.as_view(), name='post'),
    path('update/<str:pk>', FormulaCrudAsync.as_view(), name='patch'),
    path('get/workspace/<str:workspace_id>', FormulaCrudSync.as_view(), name='get'),
    path('delete/<str:pk>', FormulaCrudSync.as_view(), name='delete'),

    path('domain/nnf', NegationNormalizer.as_view(), name='nnf')
]
