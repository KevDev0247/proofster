from typing import Dict
from backend.app.models import Formula
from Enums import Connective, Type

class Binary(Formula):
    def __init__(
            self,
            left: Formula,
            right: Formula,
            connective: Connective
    ):
        super().__init__(Type.BINARY)
        self._left = left
        self._connective = connective
        self._right = right
        self._is_clause = False

    def print_formula(self):
        print("(", end="")
        self._left.print_formula()
        if self._connective == Connective.IMPLICATION:
            print(" ⇒ ", end="")
        if self._connective == Connective.BICONDITIONAL:
            print(" ⇔ ", end="")
        if self._connective == Connective.AND:
            print(" ∧ ", end="")
        if self._connective == Connective.OR:
            print(" ∨ ", end="")
        self._right.print_formula()
        print(")", end="")

    def get_left(self) -> Formula:
        return self._left

    def get_connective(self) -> Connective:
        return self._connective

    def get_right(self) -> Formula:
        return self._right

    def get_is_clause(self) -> bool:
        return self._is_clause

    def set_var(self, var: str):
        self._left.set_var(var)
        self._right.set_var(var)

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count
        self._left.set_var_count(var_count)
        self._right.set_var_count(var_count)

    def set_left(self, left: Formula):
        self._left = left

    def set_connective(self, connective: Connective):
        self._connective = connective

    def set_right(self, right: Formula):
        self._right = right

    def set_is_clause(self, is_clause: bool):
        self._is_clause = is_clause

