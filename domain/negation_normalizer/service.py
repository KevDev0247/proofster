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

    if is_proof:
        if DEBUG:
            print("Sub step 1. negating conclusion")
        normalizer.negate_conclusion()
        if DEBUG:
            normalizer.print_argument()
            print("")

    if DEBUG:
        print("Sub step 2. removing arrows")
    for f, formula in enumerate(arg):
        arg[f] = normalizer.remove_arrows(formula)
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
    if DEBUG:
        normalizer.print_argument()
        print("")
    
    return normalizer

def lambda_handler(event, context):
    argument_json = event.get("queryStringParameters", {}).get("argument_json")
    is_proof = event.get("queryStringParameters", {}).get("is_proof")

    argument = []
    for formula_json in argument_json:
        formula = create_formula_from_json(json.load(formula_json))
        argument.append(formula)
    
    normalizer = normalize(argument, is_proof)
    body = {
        'argument_json': normalizer.to_json(),
        'argument_string': normalizer.to_string()
    }

    return {
        'statusCode': 200,
        'body': json.dumps(body)
    }
