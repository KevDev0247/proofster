import json
from typing import List
from models.Binary import Binary
from models.Enums import Connective, Quantifier
from models.Formula import Formula
from models.Function import Function
from models.Unary import Unary
from models.Variable import Variable


def transpile(tokens: List[str]) -> Formula:
    stack = []
    var_count = {}

    for t, token in enumerate(tokens):
        if token == "->":
            right = stack.pop()
            left = stack.pop()

            stack.append(
                Binary(left, right, Connective.IMPLICATION)
            )
        if token == "<->":
            right = stack.pop()
            left = stack.pop()

            stack.append(
                Binary(left, right, Connective.BICONDITIONAL)
            )
        if token == "AND":
            right = stack.pop()
            left = stack.pop()

            stack.append(
                Binary(left, right, Connective.AND)
            )
        if token == "OR":
            right = stack.pop()
            left = stack.pop()

            stack.append(
                Binary(left, right, Connective.OR)
            )
        if token == "FORM":
            func_name = tokens[t + 1]
            var_name = tokens[t + 2]

            if var_name not in var_count:
                var_count[var_name] = 1
            else:
                var_count[var_name] += 1

            stack.append(
                Function(func_name, Variable(var_name))
            )
        if token == "NOT":
            inside = stack.pop()

            stack.append(
                Unary(inside, Quantifier.NONE, True, "")
            )
        if token == "FORALL":
            inside = stack.pop()
            var_name = tokens[t + 1]

            if var_name not in var_count:
                var_count[var_name] = 1

            stack.append(
                Unary(inside, Quantifier.UNIVERSAL, False, var_name)
            )
        if token == "EXIST":
            inside = stack.pop()
            var_name = tokens[t + 1]

            if var_name not in var_count:
                var_count[var_name] = 1

            stack.append(
                Unary(inside, Quantifier.EXISTENTIAL, False, var_name)
            )
        if token == "done":
            break

    formula = stack.pop()
    formula.set_var_count(var_count)
    return formula


def execute_shunting_yard(tokens: List[str]) -> List[str]:
    postfix_queue = []
    operator_stack = []

    for t, token in enumerate(tokens):
        if token == "FORM":
            function = [token, tokens[t + 1], tokens[t + 2]]
            postfix_queue.insert(0, function)

        if token == "FORALL" or token == "EXIST":
            quantifier = [token, tokens[t + 1]]
            operator_stack.append(quantifier)

        if token == "->" or token == "<->" or token == "AND" or token == "OR" or token == "NOT":
            operator_stack.append(token)
            
        if token == ")":
            operator = operator_stack.pop()
            postfix_queue.insert(0, operator)

    while operator_stack:
        postfix_queue.insert(0, operator_stack.pop())
    postfix_queue.reverse()

    result = []
    for item in postfix_queue:
        if isinstance(item, list):
            result += [sub_item for sub_item in item]
        else:
            result.append(item)
    return result


def lambda_handler(event, context):
    body = json.loads(event['body'])
    input_mode = body.get("input_mode")
    formula_input = body.get("formula_input")
    tokens = formula_input.split()

    body = {}
    if input_mode == "Infix" or input_mode == "Natural":
        formula_postfix_tokens = execute_shunting_yard(tokens)
        formula = transpile(formula_postfix_tokens)

        body = {
            'formula_json': formula.to_json(),
            'formula_result': formula.to_string(),
            'formula_postfix': ' '.join(formula_postfix_tokens)
        }
    if input_mode == "Postfix":
        formula_postfix = formula_input
        formula = transpile(tokens)

        body = {
            'formula_json': formula.to_json(),
            'formula_result': formula.to_string(),
            'formula_postfix': formula_postfix
        }

    return {
        'statusCode': 200,
        'body': json.dumps(body)
    }
