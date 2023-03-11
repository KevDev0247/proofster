from rest_framework import serializers
from api.models import Formula


class FormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formula
        fields = '__all__'

    def rabbitmq(formulas):
        return [
            {
                'is_conclusion': formula.is_conclusion,
                'formula_input': formula.formula_input,
                'input_mode': formula.input_mode,
                'workspace_id': str(formula.workspace_id),
                'formula_id': str(formula.formula_id)
            }
            for formula in formulas
        ]
