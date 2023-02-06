from django.db import models
import uuid


class Formula(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    name = models.CharField(
        max_length=255, 
        unique=True
    )
    is_conclusion = models.BooleanField(default=False)
    formula_json = models.JSONField()
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now_add=True)

    workspace_id = models.UUIDField(default=uuid.uuid4)

    class Meta:
        db_table = "formulas"
        ordering = ['-createdAt']

        def __str__(self) -> str:
            return self.title
