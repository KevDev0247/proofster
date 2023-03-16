import json
from datetime import datetime
from rest_framework import status
from django.http import JsonResponse
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from api.serializers import WorkspaceSerializer
from api.service import get_workspace_by_user, get_workspace


@method_decorator(csrf_exempt, name='dispatch')
class Workspaces(View):

    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        workspace = {
            'name': data.get('name'),
            'user_id': data.get('user_id')
        }
        
        serializer = WorkspaceSerializer(data=workspace)
        if serializer.is_valid():
            serializer.save()

            return JsonResponse({ 
                "workspace": serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return JsonResponse({
                "message": serializer.errors
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        user_id = request.GET.get('user_id')
        workspaces = get_workspace_by_user(user_id)
        
        serializer = WorkspaceSerializer(
            workspaces, 
            many=True
        )
        return JsonResponse({
            "workspaces": serializer.data
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class WorkspaceDetail(View):

    def patch(self, request, pk):
        data = json.loads(request.body.decode('utf-8'))

        workspace = get_workspace(pk)
        if workspace == None:
            return JsonResponse({
                'message': f"Workspace with Id: {pk} not found",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = WorkspaceSerializer(
            instance=workspace,
            data=data,
            partial=True
        )
        if serializer.is_valid():
            serializer.validated_data['updated_at'] = datetime.now()
            serializer.save()

            return JsonResponse({
                'workspace': serializer.data,
            }, status=status.HTTP_200_OK)
        else:
            return JsonResponse({
                'message': serializer.errors,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        workspace = get_workspace(pk)
        if workspace == None:
            return JsonResponse({
                'message': f"Workspace with Id: {pk} not found",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        workspace.delete()
        return JsonResponse({}, status=status.HTTP_200_OK)