from django.db import models
import uuid


class Workspace(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    name = models.CharField(
        max_length=255, 
        unique=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    user_id = models.IntegerField()

    class Meta:
        db_table = "workspaces"
        ordering = ['-created_at']

        def __str__(self) -> str:
            return self.title