from typing import Dict
from .Enums import Type
from .FormulaModel import FormulaModel


class VariableModel(FormulaModel):
    def __init__(self, var_name):
        super().__init__(Type.VARIABLE)
        self._var_name = var_name

    def to_string(self) -> str:
        return self._var_name

    def get_var_name(self) -> str:
        return self._var_name

    def set_var(self, var_name):
        self._var_name = var_name

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count