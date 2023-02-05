import json
from typing import Dict
from .Formula import Formula
from .Enums import Type, Quantifier

class Unary(Formula):
    def __init__(
            self,
            inside: Formula,
            quantifier: Quantifier,
            negation: bool,
            quant_var: str,
            var_count=None,
            quant_list=None
    ):
        super().__init__(
            Type.UNARY,
            var_count,
            quant_list
        )
        self._inside = inside
        self._quantifier = quantifier
        self._negation = negation
        self._quant_var = quant_var

    def to_json(self) -> json:
        return {
            'inside': self._inside.to_json(),
            'quantifier': self._quantifier,
            'negation': self._negation,
            'quant_var': self._quant_var,
            'var_count': self._var_count,
            'quant_list': self._quant_list
        }

    def from_json(self, json_data) -> Formula:
        inside = self._inside.to_json()
        quantifier = self._quantifier
        negation = self._negation
        quant_var = self._quant_var
        var_count = json_data['var_count']
        quant_list = json_data['quant_list']

        return Unary(
            inside,
            quantifier,
            negation,
            quant_var,
            var_count,
            quant_list
        )

    def to_string(self) -> str:
        result = ""
        if self._negation:
            result += "¬"
        if self._quantifier == Quantifier.EXISTENTIAL:
            result += "∃"
        if self._quantifier == Quantifier.UNIVERSAL:
            result += "∀"
        result += self._inside.to_string()
        return result

    def get_quantifier(self) -> Quantifier:
        return self._quantifier

    def get_inside(self) -> Formula:
        return self._inside

    def get_quant_var(self) -> str:
        return self._quant_var

    def get_negation(self):
        return self._negation

    def set_var(self, var: str):
        self._inside.set_var(var)

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count
        self._inside.set_var_count(var_count)

    def set_quantifier(self, quantifier: Quantifier):
        self._quantifier = quantifier

    def set_inside(self, inside: Formula):
        self._inside = inside

    def set_quant_var(self, quant_var: str):
        self._quant_var = quant_var

    def set_negation(self, negation: bool):
        self._negation = negation
