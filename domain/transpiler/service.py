import json
from typing import List
from models.Binary import Binary
from models.Enums import Connective, Quantifier
from models.Formula import Formula
from models.Function import Function
from models.Unary import Unary
from models.Variable import Variable

def transpile(formula_input: List[str]) -> Formula:
    formula_holder = []
    var_count = {}

    for t, token in enumerate(formula_input):
        if token == "->":
            right = formula_holder.pop()
            left = formula_holder.pop()

            formula_holder.append(
                Binary(left, right, Connective.IMPLICATION)
            )
        if token == "<->":
            right = formula_holder.pop()
            left = formula_holder.pop()

            formula_holder.append(
                Binary(left, right, Connective.BICONDITIONAL)
            )
        if token == "AND":
            right = formula_holder.pop()
            left = formula_holder.pop()

            formula_holder.append(
                Binary(left, right, Connective.AND)
            )
        if token == "OR":
            right = formula_holder.pop()
            left = formula_holder.pop()

            formula_holder.append(
                Binary(left, right, Connective.OR)
            )
        if token == "FORM":
            func_name = formula_input[t + 1]
            var_name = formula_input[t + 2]

            if var_name not in var_count:
                var_count[var_name] = 1
            else:
                var_count[var_name] += 1

            formula_holder.append(
                Function(func_name, Variable(var_name))
            )
        if token == "NOT":
            inside = formula_holder.pop()

            formula_holder.append(
                Unary(inside, Quantifier.NONE, True, "")
            )
        if token == "FORALL":
            inside = formula_holder.pop()
            var_name = formula_input[t + 1]

            if var_name not in var_count:
                var_count[var_name] = 1

            formula_holder.append(
                Unary(inside, Quantifier.UNIVERSAL, False, var_name)
            )
        if token == "EXIST":
            inside = formula_holder.pop()
            var_name = formula_input[t + 1]

            if var_name not in var_count:
                var_count[var_name] = 1

            formula_holder.append(
                Unary(inside, Quantifier.EXISTENTIAL, False, var_name)
            )
        if token == "done":
            break

    formula = formula_holder.pop()
    formula.set_var_count(var_count)
    return formula

def lambda_handler(event, context):
    formula_postfix = event.get("queryStringParameters", {}).get("formula_postfix").replace('"', '')
    formula_input = formula_postfix.split()
    formula = transpile(formula_input)
    body = {
        'formula_json': formula.to_json(),
        'formula_result': formula.to_string()
    }

    return {
        'statusCode': 200,
        'body': json.dumps(body)
    }
