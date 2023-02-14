from typing import List
from models.Enums import Quantifier, Type, Connective
from models.Formula import Formula
from models.Binary import Binary

def clause_to_json(clause_group: List[List[Formula]]) -> List[List[dict]]:
    clause_group_json = []
    for clause in clause_group:
        clause_json = []
        for formula in clause:
            clause_json.append(formula.to_json())
        clause_group_json.append(clause_json)
    return clause_group_json

def clause_to_string(clause_group: List[List[Formula]]) -> str:
    result = ""
    for c, clause in enumerate(clause_group):
        for f, formula in enumerate(clause):
            result += formula.to_string()
            if f < len(clause) - 1:
                result += " ∨ "
        if c < len(clause_group) - 1:
            result += ", "
    return result


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

    def convert_binary_formula_to_cnf(self, formula: Formula, self_check: bool) -> Formula:
        left = formula.get_left()
        right = formula.get_right()
        left_type = left.get_formula_type()
        right_type = right.get_formula_type()

        if (left_type == Type.BINARY
                and formula.get_connective() == Connective.OR
                and left.get_connective() == Connective.AND):
            if self_check:
                # convert the current binary formula to cnf
                formula = self.convert_to_cnf(formula)
            else:
                # perform basic conversion procedure, but won't result a cnf
                formula.set_left(
                    Binary(
                        self.convert_to_cnf(left.get_left()),
                        self.convert_to_cnf(right),
                        Connective.OR
                    )
                )
                formula.set_right(
                    Binary(
                        self.convert_to_cnf(left.get_right()),
                        self.convert_to_cnf(right),
                        Connective.OR
                    )
                )
                formula.set_connective(Connective.AND)
        if (right_type == Type.BINARY
                and formula.get_connective() == Connective.OR
                and right.get_connective() == Connective.AND):
            if self_check:
                # convert the current binary formula to cnf
                formula = self.convert_to_cnf(formula)
            else:
                # perform basic conversion procedure, but won't result a cnf
                formula.set_left(
                    Binary(
                        self.convert_to_cnf(left),
                        self.convert_to_cnf(right.get_left()),
                        Connective.OR
                    )
                )
                formula.set_right(
                    Binary(
                        self.convert_to_cnf(left),
                        self.convert_to_cnf(right.get_right()),
                        Connective.OR
                    )
                )
                formula.set_connective(Connective.AND)

        if not self_check:
            # make another recursive call to ensure both sides are in CNF
            formula.set_left(self.convert_to_cnf(formula.get_left()))
            formula.set_right(self.convert_to_cnf(formula.get_right()))
        return formula

    def convert_to_cnf(self, formula: Formula) -> Formula:
        if formula.get_formula_type() == Type.UNARY:
            if formula.get_inside().get_formula_type() == Type.FUNCTION:
                formula.get_inside().set_negation(formula.get_negation())
            # recursively search the inside of unary to perform the conversion procedure
            formula = self.convert_to_cnf(formula.get_inside())
        if formula.get_formula_type() == Type.BINARY:
            # convert the two sides of binary into CNF and change connective
            formula = self.convert_binary_formula_to_cnf(formula, False)
            # convert the newly formed binary to CNF
            formula = self.convert_binary_formula_to_cnf(formula, True)
        return formula

    def populate_clause(self, formula: Formula, clause: List[Formula]) -> List[Formula]:
        if formula.get_formula_type() == Type.BINARY:
            clause = self.populate_clause(formula.get_left(), clause)
            clause = self.populate_clause(formula.get_right(), clause)
            return clause
        else:
            clause.append(formula)
            return clause

    def populate_clause_group(self, formula: Formula, clause_group: List[List[Formula]]) -> bool:
        if formula.get_formula_type() != Type.BINARY:
            return True
        else:
            if (formula.get_connective() == Connective.OR
                    and self.populate_clause_group(formula.get_left(), clause_group)
                    and self.populate_clause_group(formula.get_right(), clause_group)):
                return True
            elif formula.get_connective() == Connective.AND:
                if self.populate_clause_group(formula.get_left(), clause_group):
                    new_clause = []
                    new_clause = self.populate_clause(
                        formula.get_left(), new_clause
                    )
                    clause_group.append(new_clause)
                if self.populate_clause_group(formula.get_right(), clause_group):
                    new_clause = []
                    new_clause = self.populate_clause(
                        formula.get_right(), new_clause
                    )
                    clause_group.append(new_clause)
                return False
