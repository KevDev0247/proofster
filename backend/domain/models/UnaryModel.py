from typing import Dict
from backend.app.models import Formula
from Enums import Type, Quantifier

class Unary(Formula):
    def __init__(
            self,
            inside: Formula,
            quantifier: Quantifier,
            negation: bool,
            quant_var: str
    ):
        super().__init__(Type.UNARY)
        self._quantifier = quantifier
        self._inside = inside
        self._quant_var = quant_var
        self._negation = negation

    def print_formula(self):
        if self._negation:
            print("¬", end="")
        if self._quantifier == Quantifier.EXISTENTIAL:
            print("∃" + self._quant_var, end="")
        if self._quantifier == Quantifier.UNIVERSAL:
            print("∀" + self._quant_var, end="")
        self._inside.print_formula()

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
