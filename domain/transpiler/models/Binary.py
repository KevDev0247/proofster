import json
from typing import Dict
from .Enums import Connective, Type
from .Formula import Formula

class Binary(Formula):

    def __init__(
            self,
            left: Formula,
            right: Formula,
            connective: Connective,
            is_clause=False,
            var_count=None,
            quant_list=None
    ):
        super().__init__(
            Type.BINARY,
            var_count,
            quant_list
        )
        self._left = left
        self._connective = connective
        self._right = right
        self._is_clause = is_clause

    def to_json(self) -> json:
        return {
            'left': self._left.to_json(),
            'right': self._right.to_json(),
            'connective': self._connective,
            'is_clause': self._is_clause,
            'var_count': self._var_count,
            'quant_list': self._quant_list
        }

    def from_json(self, json_data) -> Formula:
        left = self._left.from_json(json_data['left'])
        right = self._right.from_json(json_data['right'])
        connective = Connective(json_data['connective'])
        is_clause = json_data['is_clause']
        var_count = json_data['var_count']
        quant_list = json_data['quant_list']

        return Binary(
            left,
            right,
            connective,
            is_clause,
            var_count,
            quant_list
        )

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


