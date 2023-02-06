from django.urls import path
from api.views import Workspaces, WorkspaceDetail

urlpatterns = [
    path('', Workspaces.as_view()),
    path('<str:pk>', WorkspaceDetail.as_view())
]