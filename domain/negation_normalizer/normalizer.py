from typing import List
from models.Binary import Binary
from models.Enums import Connective, Quantifier, Type
from models.Formula import Formula
from models.Unary import Unary


class Normalizer:
    def __init__(self, arg: List[Formula]):
        self._arg = arg
        self._premises = []
        self._negated_conclusion = []
        self._subscript = 0

    def get_arg(self) -> List[Formula]:
        return self._arg

    def get_premises(self) -> List[Formula]:
        return self._premises

    def get_negated_conclusion(self) -> Formula:
        return self._negated_conclusion

    def get_subscript(self) -> int:
        return self._subscript;

    def set_subscript(self, subscript):
        self._subscript = subscript

    def to_string(self) -> List[str]:
        result = []
        for formula in self._arg:
            formula_string = ""
            quant_list = formula.get_quant_list()
            for quant, var in quant_list:
                if quant == Quantifier.EXISTENTIAL:
                    formula_string += "∃" + var
                if quant == Quantifier.UNIVERSAL:
                    formula_string += "∀" + var
            formula_string += formula.to_string()
            result.append(formula_string)
        return result

    def to_json(self) -> List[dict]:
        result = []
        for formula in self._arg:
            result.append(formula.to_json())
        return result

    def print_argument(self):
        formulas_strings = self.to_string()
        for formula_string in formulas_strings:
            print(formula_string)

    def negate_conclusion(self):
        conclusion = self._arg.pop()
        unary = Unary(conclusion, Quantifier.NONE, True, "")
        unary.set_var_count(conclusion.get_var_count())
        self._arg.append(unary)

    def remove_arrows(self, formula: Formula) -> Formula:
        formula_type = formula.get_formula_type()
        if formula_type == Type.BINARY:
            new_left = self.remove_arrows(formula.get_left())
            new_right = self.remove_arrows(formula.get_right())

            if formula.get_connective() == Connective.IMPLICATION:
                formula.set_left(
                    Unary(new_left, Quantifier.NONE, True, "")
                )
                formula.set_right(new_right)
                formula.set_connective(Connective.OR)

            if formula.get_connective() == Connective.BICONDITIONAL:
                formula.set_left(
                    Binary(
                        new_left,
                        new_right,
                        Connective.AND
                    )
                )
                formula.set_right(
                    Binary(
                        Unary(new_left, Quantifier.NONE, True, ""),
                        Unary(new_right, Quantifier.NONE, True, ""),
                        Connective.AND
                    )
                )
                formula.set_connective(Connective.OR)

        if formula_type == Type.UNARY:
            formula.set_inside(
                self.remove_arrows(formula.get_inside())
            )
        return formula

    def move_negation_inward(self, formula: Formula, negation_outside: bool) -> Formula:
        formula_type = formula.get_formula_type()
        if formula_type == Type.BINARY:
            # recursively moving negation inwards for all parts of the formula
            formula.set_left(
                self.move_negation_inward(
                    formula.get_left(),
                    negation_outside
                )
            )
            formula.set_right(
                self.move_negation_inward(
                    formula.get_right(),
                    negation_outside
                )
            )
            # Perform procedure for De Morgan's Law
            if negation_outside and formula.get_connective() == Connective.AND:
                formula.set_connective(Connective.OR)
            elif negation_outside and formula.get_connective() == Connective.OR:
                formula.set_connective(Connective.AND)

        if formula_type == Type.UNARY:
            if negation_outside and formula.get_negation():
                # if previous negation cancels out, we don't reverse quantifiers no negation passed
                formula.set_inside(
                    self.move_negation_inward(formula.get_inside(), False)
                )
            elif negation_outside or formula.get_negation():
                # if previous negates results in a negation, we need to reverse quantifiers and pass the negation
                if formula.get_quantifier() == Quantifier.UNIVERSAL:
                    formula.set_quantifier(Quantifier.EXISTENTIAL)
                elif formula.get_quantifier() == Quantifier.EXISTENTIAL:
                    formula.set_quantifier(Quantifier.UNIVERSAL)

                formula.set_inside(
                    self.move_negation_inward(formula.get_inside(), True)
                )
            else:
                # if no negation, we don't reverse quantifiers no negation passed
                formula.set_inside(
                    self.move_negation_inward(formula.get_inside(), False)
                )

        if (negation_outside
                and formula_type != Type.BINARY
                and formula_type != Type.UNARY):
            # if formula is function, and there's a negation, wraps it in a unary with negation
            formula = Unary(formula, Quantifier.NONE, True, "")
        if formula_type == Type.UNARY:
            # if formula is unary, then we are returning to previous, don't add negation
            formula.set_negation(False)

        return formula
