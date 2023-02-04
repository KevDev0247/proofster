from typing import List
from backend.app.models import Formula
from models.FormulaModel import FormulaModel


class DeserializeService:
    def construct_formula(self, formula: Formula) -> FormulaModel:
        if formula.is_binary:
            pass
        if formula.is_unary:
            pass
        if formula.is_function and formula.has_atom_inside:
            pass
        if formula.is_function and not formula.has_atom_inside:
            pass
        if formula.is_variable:
            pass

    def deserialize(self, ids: List[int]) -> List[FormulaModel]:
        db_formulas = []
        for id in ids:
            db_formulas.append(Formula.query.get(id))
        
        domain_formulas = []
        for formula in db_formulas:
            domain_formulas.append(self.construct_formula(formula))
        
