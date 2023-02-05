import json
from typing import Dict
from .Enums import Type
from .Formula import Formula


class Function(Formula):
    def __init__(
            self,
            func_name: str,
            inside: Formula,
            negation=False,
            assigned=True,
            var_count=None,
            quant_list=None
    ):
        super().__init__(
            Type.FUNCTION,
            var_count,
            quant_list
        )
        self._func_name = func_name
        self._inside = inside
        self._negation = negation
        self._assigned = assigned

    def to_json(self) -> json:
        return {
            'func_name': self._func_name,
            'inside': self._inside.to_json(),
            'negation': self._negation,
            'assigned': self._assigned,
            'var_count': self._var_count,
            'quant_list': self._quant_list
        }

    def from_json(self, json_data) -> Formula:
        func_name = self._func_name
        inside = self._inside.to_json()
        negation = self._negation
        assigned = self._assigned
        var_count = json_data['var_count']
        quant_list = json_data['quant_list']

        return Function(
            func_name,
            inside,
            negation,
            assigned,
            var_count,
            quant_list
        )

    def to_string(self) -> str:
        result = ""
        if self._negation:
            result += "¬"
        result += self._func_name
        result += "("
        result += self._inside.to_string()
        result += ")"
        return result

    def get_func_name(self) -> str:
        return self._func_name

    def get_inside(self) -> Formula:
        return self._inside

    def get_negation(self) -> bool:
        return self._negation

    def get_assigned(self) -> bool:
        return self._assigned

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count
        self._inside.set_var_count(var_count)

    def set_var(self, var):
        self._inside.set_var(var)

    def set_inside(self, inside: Formula):
        self._inside = inside

    def set_negation(self, negation: bool):
        self._negation = negation

    def set_assigned(self, assigned: bool):
        self._assigned = assigned
