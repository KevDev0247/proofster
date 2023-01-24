from typing import Dict
from Enums import Type
from models.FormulaModel import Formula


class Function(Formula):
    def __init__(self, name: str, inside: Formula):
        super().__init__(Type.FUNCTION)
        self._func_name = name
        self._inside = inside
        self._negation = False
        self._assigned = True

    def print_formula(self):
        if self._negation:
            print("¬", end="")
        print(self._func_name + "(", end="")
        self._inside.print_formula()
        print(")", end="")

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