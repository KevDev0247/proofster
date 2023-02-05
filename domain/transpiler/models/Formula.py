from abc import ABC, abstractmethod
import json
from typing import Dict, List, Tuple
from .Enums import Type, Quantifier


class Formula(ABC):
    def __init__(
            self,
            formula_type: Type,
            var_count=None,
            quant_list=None
    ):
        if var_count is None:
            var_count = {}
        if quant_list is None:
            quant_list = []
        self._formula_type = formula_type
        self._var_count = var_count
        self._quant_list = quant_list

    def print_json(self):
        print(self.to_json())

    def print_formula(self):
        print(self.to_string(), end="")

    @abstractmethod
    def to_json(self) -> json:
        pass

    @abstractmethod
    def from_json(self, json_data) -> 'Formula':
        pass

    @abstractmethod
    def to_string(self) -> str:
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
