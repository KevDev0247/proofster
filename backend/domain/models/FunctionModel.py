from typing import Dict
from .Enums import Type
from .FormulaModel import FormulaModel


class FunctionModel(FormulaModel):
    def __init__(self, name: str, inside: FormulaModel):
        super().__init__(Type.FUNCTION)
        self._func_name = name
        self._inside = inside
        self._negation = False
        self._assigned = True

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

    def get_inside(self) -> FormulaModel:
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

    def set_inside(self, inside: FormulaModel):
        self._inside = inside

    def set_negation(self, negation: bool):
        self._negation = negation

    def set_assigned(self, assigned: bool):
        self._assigned = assigned
