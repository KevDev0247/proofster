from abc import ABC, abstractmethod
from typing import Dict, List, Tuple
from Enums import Type, Quantifier


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
