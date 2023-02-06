from rest_framework.response import Response
from rest_framework import status, generics
from api.models import Workspace
from api.serializers import WorkspaceSerializer


class Workspaces(generics.GenericAPIView):
    serializer_class = WorkspaceSerializer
    queryset = Workspace.objects.all()

    def get(self, request):
        workspace_id = request.GET.get("user_id")
        workspaces = Workspace.objects.all()

        if workspace_id:
            workspaces = workspaces.filter(workspace_id=workspace_id)
        serializer = self.serializer_class(workspaces, many=True)
        return Response({
            "status": "success",
            "workspaces": serializer.data
        })

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success", 
                    "workspace": serializer.data
                }, 
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {
                    "status": "fail", 
                    "message": serializer.errors
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )


class WorkspaceDetail(generics.GenericAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer

    def get_workspace(self, pk):
        try:
            return Workspace.objects.get(pk=pk)
        except:
            return None

    def patch(self, request, pk):
        workspace = self.get_workspace(pk=pk)
        if workspace == None:
            return Response(
                {
                    "status": "fail",
                    "message": f"Workspace with Id: {pk} not found",
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.serializer_class(workspace)
        return Response({
            "status": "success",
            "workspace": serializer.data
        })

    def delete(self, request, pk):
        workspace = self.get_workspace(pk)
        if workspace == None:
            return Response(
                {
                    "status": "fail",
                    "message": f"Workspace with Id: {pk} not found",
                },
                status=status.HTTP_404_NOT_FOUND
            )

        workspace.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)