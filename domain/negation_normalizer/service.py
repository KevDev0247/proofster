import json
from typing import List
from normalizer import Normalizer
from factory import create_formula_from_json
from models.Enums import Type
from models.Formula import Formula

DEBUG = False


def normalize(argument: List[Formula], is_proof: bool) -> Normalizer:
    normalizer = Normalizer(argument)
    arg = normalizer.get_arg()

    negated_conclusion_json, negated_conclusion_string = None, None
    if is_proof:
        if DEBUG:
            print("Sub step 1. negating conclusion")
        normalizer.negate_conclusion()
        negated_conclusion_json = normalizer.to_json()
        negated_conclusion_string = normalizer.to_string()
        if DEBUG:
            normalizer.print_argument()
            print("")

    if DEBUG:
        print("Sub step 2. removing arrows")
    for f, formula in enumerate(arg):
        arg[f] = normalizer.remove_arrows(formula)
    removed_arrow_json = normalizer.to_json()
    removed_arrow_string = normalizer.to_string()
    if DEBUG:
        normalizer.print_argument()
        print("")

    if DEBUG:
        print("Sub step 3. moving negation inward")
    for f, formula in enumerate(arg):
        formula_type = formula.get_formula_type()
        var_count = formula.get_var_count()
        
        if formula_type == Type.UNARY:
            arg[f] = normalizer.move_negation_inward(formula, False)
            arg[f].set_quantifier(formula.get_quantifier())
            arg[f].set_var_count(var_count)

        if formula_type == Type.BINARY:
            arg[f] = normalizer.move_negation_inward(formula, False)
            arg[f].set_var_count(var_count)
    nnf_json = normalizer.to_json()
    nnf_string = normalizer.to_string()
    if DEBUG:
        normalizer.print_argument()
        print("")
    
    return {
        'negated_conclusion_string': negated_conclusion_string,
        'removed_arrow_string': removed_arrow_string,
        'nnf_string': nnf_string,
        'negated_conclusion_json': negated_conclusion_json,
        'removed_arrow_json': removed_arrow_json,
        'nnf_json': nnf_json
    }

def lambda_handler(event, context):
    body = json.loads(event['body'])
    argument_json = body.get("argument_json")
    is_proof = body.get("is_proof")

    argument = []
    for formula_json in argument_json:
        formula = create_formula_from_json(formula_json)
        argument.append(formula)
    
    response = normalize(argument, is_proof)

    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
