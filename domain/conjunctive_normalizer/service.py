import json
from typing import List
from normalizer import Normalizer, clause_to_json, clause_to_string
from factory import create_formula_from_json
from models.Formula import Formula

DEBUG = False


def normalize(argument: List[Formula]) -> Normalizer:
    normalizer = Normalizer(argument)
    arg = normalizer.get_arg()

    if DEBUG:
        print("Sub step 1. dropping all quantifiers")
    for f, formula in enumerate(arg):
        arg[f].set_quant_list([])

    if DEBUG:
        normalizer.print_argument()
        print("")

    if DEBUG:
        print("Sub step 2. converting to Conjunctive Normal Form")
    for f, formula in enumerate(arg):
        arg[f] = normalizer.convert_to_cnf(formula)

    if DEBUG:
        normalizer.print_argument()
        print("")

    return normalizer

def generate_clauses(normalizer: Normalizer):
    arg = normalizer.get_arg()

    if DEBUG:
        print("Generating clauses")
    clauses = []
    for f, formula in enumerate(arg):
        clause_group = []
        if normalizer.populate_clause_group(formula, clause_group):
            new_clause = []
            new_clause = normalizer.populate_clause(formula, new_clause)
            clause_group.append(new_clause)
        clauses.append(clause_group)

    return clauses

def lambda_handler(event, context):
    body = json.loads(event['body'])
    argument_json = body.get("argument_json")

    argument = []
    for formula_json in argument_json:
        formula = create_formula_from_json(formula_json)
        argument.append(formula)
    
    normalizer = normalize(argument)

    clauses = generate_clauses(normalizer)
    clauses_json, clauses_string = [], []
    for clause in clauses:
        clauses_json.append(clause_to_json(clause))
        clauses_string.append(clause_to_string(clause))

    body = {
        'argument_json': normalizer.to_json(),
        'argument_string': normalizer.to_string(),
        'clauses_json': clauses_json,
        'clauses_string': clauses_string
    }

    return {
        'statusCode': 200,
        'body': json.dumps(body)
    }
