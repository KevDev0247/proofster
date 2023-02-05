from typing import List
from ..models.Binary import Binary
from ..models.Enums import Connective, Quantifier
from ..models.Formula import Formula
from ..models.Function import Function
from ..models.Unary import Unary
from ..models.Variable import Variable


class TranspilerService:
    def __init__(self) -> None:
        pass

    def transpile(self, formula_input: List[str]) -> Formula:
        formula_holder = []
        var_count = {}

        for p, part in enumerate(formula_input):
            if part == "->":
                right = formula_holder.pop()
                left = formula_holder.pop()

                formula_holder.append(
                    Binary(left, right, Connective.IMPLICATION)
                )
            if part == "<->":
                right = formula_holder.pop()
                left = formula_holder.pop()

                formula_holder.append(
                    Binary(left, right, Connective.BICONDITIONAL)
                )
            if part == "AND":
                right = formula_holder.pop()
                left = formula_holder.pop()

                formula_holder.append(
                    Binary(left, right, Connective.AND)
                )
            if part == "OR":
                right = formula_holder.pop()
                left = formula_holder.pop()

                formula_holder.append(
                    Binary(left, right, Connective.OR)
                )
            if part == "FORM":
                func_name = formula_input[p + 1]
                var_name = formula_input[p + 2]

                if var_name not in var_count:
                    var_count[var_name] = 1
                else:
                    var_count[var_name] += 1

                formula_holder.append(
                    Function(func_name, Variable(var_name))
                )
            if part == "NOT":
                inside = formula_holder.pop()

                formula_holder.append(
                    Unary(inside, Quantifier.NONE, True, "")
                )
            if part == "FORALL":
                inside = formula_holder.pop()
                var_name = formula_input[p + 1]

                if var_name not in var_count:
                    var_count[var_name] = 1

                formula_holder.append(
                    Unary(inside, Quantifier.UNIVERSAL, False, var_name)
                )
            if part == "EXIST":
                inside = formula_holder.pop()
                var_name = formula_input[p + 1]

                if var_name not in var_count:
                    var_count[var_name] = 1

                formula_holder.append(
                    Unary(inside, Quantifier.EXISTENTIAL, False, var_name)
                )
            if part == "done":
                break

        formula = formula_holder.pop()
        formula.set_var_count(var_count)
        return formula