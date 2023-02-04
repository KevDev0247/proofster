from typing import Dict
from .Enums import Connective, Type
from .FormulaModel import FormulaModel

class BinaryModel(FormulaModel):
    def __init__(
            self,
            left: FormulaModel,
            right: FormulaModel,
            connective: Connective
    ):
        super().__init__(Type.BINARY)
        self._left = left
        self._connective = connective
        self._right = right
        self._is_clause = False

    def to_string(self) -> str:
        result = "(" + self._left.to_string()
        if self._connective == Connective.IMPLICATION:
            result += " ⇒ "
        if self._connective == Connective.BICONDITIONAL:
            result += " ⇔ "
        if self._connective == Connective.AND:
            result += " ∧ "
        if self._connective == Connective.OR:
            result += " ∨ "
        result += self._right.to_string()
        result += ")"
        return result

    def get_left(self) -> FormulaModel:
        return self._left

    def get_connective(self) -> Connective:
        return self._connective

    def get_right(self) -> FormulaModel:
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

    def set_left(self, left: FormulaModel):
        self._left = left

    def set_connective(self, connective: Connective):
        self._connective = connective

    def set_right(self, right: FormulaModel):
        self._right = right

    def set_is_clause(self, is_clause: bool):
        self._is_clause = is_clause

