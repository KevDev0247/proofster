from rest_framework import serializers
from api.models import Formula, FormulaLegacy


class FormulaLegacySerializer(serializers.ModelSerializer):
    class Meta:
        model = FormulaLegacy
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if self.context.get('exclude_formula_json'):
            data.pop('formula_json', None)
        return data

class FormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formula
        fields = '__all__'

    def rabbitmq(formulas):
        return [
            {
                'is_conclusion': formula.is_conclusion,
                'formula_infix': formula.formula_infix,
                'workspace_id': str(formula.workspace_id),
                'formula_id': str(formula.formula_id)
            }
            for formula in formulas
        ]
