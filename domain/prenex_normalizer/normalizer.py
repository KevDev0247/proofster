from typing import List
from models.Enums import Quantifier, Type
from models.Formula import Formula
from models.Variable import Variable
from models.Function import Function


class Normalizer:
    def __init__(self, arg: List[Formula]):
        self._arg = arg
        self._premises = []
        self._negated_conclusion = []
        self._subscript = 0

    def get_arg(self):
        return self._arg

    def get_premises(self):
        return self._premises

    def get_negated_conclusion(self):
        return self._negated_conclusion

    def set_subscript(self, subscript: int):
        self._subscript = subscript

    def to_string(self) -> List[str]:
        result = []
        for formula in self._arg:
            formula_string = ""
            quant_list = formula.get_quant_list()
            for quant, var in quant_list:
                if Quantifier(quant) == Quantifier.EXISTENTIAL:
                    formula_string += "∃" + var
                if Quantifier(quant) == Quantifier.UNIVERSAL:
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

    def standardize_variables(self, formula: Formula, var_name: str) -> Formula:
        formula_type = formula.get_formula_type()
        if formula_type == Type.UNARY:
            if (formula.get_quant_var() == var_name
                    and formula.get_quantifier() != Quantifier.NONE):
                self._subscript += 1
                formula.set_quant_var(
                    var_name + str(self._subscript)
                )
            formula.set_inside(
                self.standardize_variables(formula.get_inside(), var_name)
            )
        elif formula_type == Type.BINARY:
            formula.set_left(
                self.standardize_variables(
                    formula.get_left(),
                    var_name
                )
            )
            formula.set_right(
                self.standardize_variables(
                    formula.get_right(),
                    var_name
                )
            )
        elif formula_type == Type.FUNCTION:
            if formula.get_inside().get_var_name() == var_name and self._subscript != 0:
                formula.set_var(var_name + str(self._subscript))
        else:
            if formula.get_var_name() == var_name:
                formula.set_var(var_name + str(self._subscript))
        return formula

    def move_quantifiers_to_front(self, formula: Formula, quant_list: List[tuple]) -> List[tuple]:
        formula_type = formula.get_formula_type()
        if formula_type == Type.BINARY:
            quant_list = self.move_quantifiers_to_front(
                formula.get_left(),
                quant_list
            )
            quant_list = self.move_quantifiers_to_front(
                formula.get_right(),
                quant_list
            )
        elif formula_type == Type.UNARY:
            if formula.get_quantifier() != Quantifier.NONE:
                quant_list.append(
                    (formula.get_quantifier().value, formula.get_quant_var())
                )
                formula.set_quantifier(Quantifier.NONE)
            quant_list = self.move_quantifiers_to_front(
                formula.get_inside(),
                quant_list
            )
        return quant_list

    def skolemize(self, formula: Formula, data: tuple[str, str]) -> Formula:
        formula_type = formula.get_formula_type()
        if formula_type == Type.BINARY:
            formula.set_left(
                self.skolemize(formula.get_left(), data)
            )
            formula.set_right(
                self.skolemize(formula.get_right(), data)
            )
        elif formula_type == Type.UNARY:
            formula.set_inside(
                self.skolemize(formula.get_inside(), data)
            )
        elif formula_type == Type.FUNCTION:
            inside = formula.get_inside()
            if inside.get_formula_type() != Type.VARIABLE:
                formula.set_inside(
                    self.skolemize(formula.get_inside(), data)
                )
            elif inside.get_var_name() == data[0]:
                prev_var = data[1]
                if prev_var == "":
                    # if there's no quantifiers
                    formula.set_inside(
                        Variable("u")
                    )
                else:
                    # if there's quantifiers outside
                    if inside.get_var_name() != prev_var:
                        formula.set_inside(
                            Function("f", Variable(prev_var))
                        )
        return formula
