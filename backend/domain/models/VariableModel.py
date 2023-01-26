from typing import Dict
from Enums import Type
from models.FormulaModel import Formula


class VariableModel(Formula):
    def __init__(self, var_name):
        super().__init__(Type.VARIABLE)
        self._var_name = var_name

    def print_formula(self):
        print(self._var_name, end="")

    def get_var_name(self) -> str:
        return self._var_name

    def set_var(self, var_name):
        self._var_name = var_name

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count