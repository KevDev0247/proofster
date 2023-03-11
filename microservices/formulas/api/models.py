from django.db import models
import uuid


class FormulaLegacy(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    name = models.CharField(max_length=255)
    is_conclusion = models.BooleanField(default=False)
    formula_postfix = models.TextField(null=True)
    formula_infix = models.TextField(null=True)
    formula_json = models.JSONField()
    formula_result = models.TextField()
    stage = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    workspace_id = models.UUIDField(default=uuid.uuid4)
    formula_id = models.UUIDField(default=uuid.uuid4)

    class Meta:
        db_table = 'formulas_legacy'
        ordering = ['-created_at']

        def __str__(self) -> str:
            return self.title
        
class Formula(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True)
    is_conclusion = models.BooleanField(default=False)
    formula_infix = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    workspace_id = models.UUIDField(default=uuid.uuid4)
    formula_id = models.UUIDField(default=uuid.uuid4)

    class Meta:
        db_table = 'formula'
        ordering = ['-created_at']

        def __str__(self) -> str:
            return self.title
