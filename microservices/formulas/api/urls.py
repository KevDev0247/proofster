from django.urls import path
from api.views.crud import FormulaSync, FormulaAsync

urlpatterns = [
    path('create/', FormulaAsync.as_view(), name='post'),
    path('update/<str:pk>', FormulaAsync.as_view(), name='patch'),
    path('get/workspace/<str:workspace_id>', FormulaSync.as_view(), name='get'),
    path('delete/<str:pk>', FormulaSync.as_view(), name='delete')
]
