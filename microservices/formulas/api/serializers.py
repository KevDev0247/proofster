from rest_framework import serializers
from api.models import Formula


class FormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formula
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if self.context.get('exclude_formula_json'):
            data.pop('formula_json', None)
        return data