from django.urls import path
from api.views import Workspaces, WorkspaceDetail

urlpatterns = [
    path('create/', Workspaces.as_view(), name='post'),
    path('get/', Workspaces.as_view(), name='get'),
    path('update/<str:pk>', WorkspaceDetail.as_view(), name='patch'),
    path('delete/<str:pk>', WorkspaceDetail.as_view(), name='delete'),
]