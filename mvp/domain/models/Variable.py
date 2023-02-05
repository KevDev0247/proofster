import json
from typing import Dict
from .Enums import Type
from .Formula import Formula


class Variable(Formula):
    def __init__(
            self,
            var_name,
            var_count=None,
            quant_list=None
    ):
        super().__init__(
            Type.VARIABLE,
            var_count,
            quant_list
        )
        self._var_name = var_name

    def to_json(self) -> json:
        return {
            'var_name': self._var_name,
            'var_count': self._var_count,
            'quant_list': self._quant_list
        }

    def from_json(self, json_data) -> Formula:
        var_name = self._var_name
        var_count = json_data['var_count']
        quant_list = json_data['quant_list']

        return Variable(
            var_name,
            var_count,
            quant_list
        )

    def to_string(self) -> str:
        return self._var_name

    def get_var_name(self) -> str:
        return self._var_name

    def set_var(self, var_name):
        self._var_name = var_name

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count
