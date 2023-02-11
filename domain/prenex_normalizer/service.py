from typing import List
from normalizer import Normalizer
from models.Enums import Quantifier, Type
from models.Formula import Formula

DEBUG = False


def normalize_and_save(argument: List[Formula]) -> List[str]:
    normalizer = Normalizer(argument)
    arg = normalizer.get_arg()

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

    if DEBUG:
        print("Sub step 4. standardizing variables")
    for f, formula in enumerate(arg):
        var_count = formula.get_var_count()

        for var in var_count:
            normalizer.set_subscript(0)
            arg[f] = normalizer.standardize_variables(formula, var)
    if DEBUG:
        normalizer.print_argument()
        print("")

    if DEBUG:
        print("Sub step 5. moving all quantifiers to front")
    for f, formula in enumerate(arg):
        arg[f].set_quant_list(
            normalizer.move_quantifiers_to_front(formula, [])
        )
    if DEBUG:
        normalizer.print_argument()
        print("")

    if DEBUG:
        print("Sub step 6. skolemizing formulas")
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
    
    return normalizer.to_string()
