import json
from typing import List
from normalizer import Normalizer
from factory import create_formula_from_json
from models.Enums import Quantifier
from models.Formula import Formula

DEBUG = False


def normalize(argument: List[Formula]) -> Normalizer:
    normalizer = Normalizer(argument)
    arg = normalizer.get_arg()

    if DEBUG:
        print("Sub step 1. standardize variables")
    for f, formula in enumerate(arg):
        var_count = formula.get_var_count()

        for var in var_count:
            normalizer.set_subscript(0)
            arg[f] = normalizer.standardize_variables(formula, var)
    if DEBUG:
        normalizer.print_argument()
        print("")

    if DEBUG:
        print("Sub step 2. moving all quantifiers to front")
    for f, formula in enumerate(arg):
        arg[f].set_quant_list(
            normalizer.move_quantifiers_to_front(formula, [])
        )
    if DEBUG:
        normalizer.print_argument()
        print("")

    if DEBUG:
        print("Sub step 3. skolemize the formula")
    for f, formula in enumerate(arg):
        drop_list = []

        # dropping the existentials in the quantifier list
        quant_list = formula.get_quant_list()
        for q, quant_holder in enumerate(quant_list.copy()):
            quantifier = quant_holder[0]
            quant_var = quant_holder[1]
            if len(quant_list) > 1:
                prev_var = quant_list[q - 1][1]
            else:
                prev_var = ""
            if (quantifier == Quantifier.EXISTENTIAL
                    and quant_var not in quant_list):
                drop_list.append((quant_var, prev_var))
                quant_list.pop(q)
                arg[f].set_quant_list(quant_list)

        # skolemize each variable in the formula
        for to_drop in drop_list:
            arg[f] = normalizer.skolemize(formula, to_drop)
    if DEBUG:
        normalizer.print_argument()
        print("")
    
    return normalizer