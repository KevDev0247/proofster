from typing import List
import uuid
from api.models import Workspace


def get_workspace(pk) -> Workspace:
    try:
        return Workspace.objects.get(pk=uuid.UUID(pk))
    except:
        return None
    
def get_workspace_by_user(
    user_id: int
) -> List[Workspace]:
    try:
        workspaces = list(Workspace.objects.filter(
            user_id=user_id
        ))
        return workspaces
    except Exception as e:
        print(f"Error occurred: {e}")
        return None