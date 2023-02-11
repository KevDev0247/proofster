from typing import List
from normalizer import Normalizer
from models.Enums import Quantifier, Type
from models.Formula import Formula

DEBUG = False


def normalize(argument: List[Formula], is_proof: bool) -> List[str]:
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

        # need to refactor the var_count set logic
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
    
    return normalizer.to_string()
