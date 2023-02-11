import json
from models.Binary import Binary
from models.Enums import Connective, Quantifier, Type
from models.Formula import Formula
from models.Function import Function
from models.Unary import Unary
from models.Variable import Variable

def create_formula_from_json(json_data: json) -> Formula:
    formula_type = json_data['formula_type']

    if Type(formula_type) == Type.BINARY:
        left = create_formula_from_json(json_data['left'])
        right = create_formula_from_json(json_data['right'])
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
    if Type(formula_type) == Type.UNARY:
        inside = create_formula_from_json(json_data['inside'])
        quantifier = Quantifier(json_data['quantifier'])
        negation = json_data['negation']
        quant_var = json_data['quant_var']
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
    if Type(formula_type) == Type.VARIABLE:
        var_name = json_data['var_name']
        var_count = json_data['var_count']
        quant_list = json_data['quant_list']

        return Variable(
            var_name,
            var_count,
            quant_list
        )
    if Type(formula_type) == Type.FUNCTION:
        func_name = json_data['func_name']
        inside = create_formula_from_json(json_data['inside'])
        negation = json_data['negation']
        assigned = json_data['assigned']
        var_count = json_data['var_count']
        quant_list = json_data['quant_list']

        return Function(
            func_name,
            inside,
            negation,
            assigned,
            var_count,
            quant_list
        )