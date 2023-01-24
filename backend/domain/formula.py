from abc import ABC, abstractmethod
from typing import Dict, List, Tuple
from enums import Connective, Type, Quantifier


class Formula(ABC):
    def __init__(self, formula_type: Type):
        self._formula_type = formula_type
        self._var_count = {}
        self._quant_list = []

    @abstractmethod
    def print_formula(self):
        pass

    @abstractmethod
    def set_var(self, var: str):
        pass

    @abstractmethod
    def set_var_count(self, var_count: Dict):
        pass

    def set_quant_list(self, quant_list: List[Tuple[Quantifier, str]]):
        self._quant_list = quant_list

    def get_formula_type(self) -> Type:
        return self._formula_type

    def get_var_count(self) -> Dict:
        return self._var_count

    def get_quant_list(self) -> List[Tuple[Quantifier, str]]:
        return self._quant_list


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


class Variable(Formula):
    def __init__(self, var_name):
        super().__init__(Type.VARIABLE)
        self._var_name = var_name

    def print_formula(self):
        print(self._var_name, end="")

    def get_var_name(self) -> str:
        return self._var_name

    def set_var(self, var_name):
        self._var_name = var_name

    def set_var_count(self, var_count: Dict):
        self._var_count = var_count


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
