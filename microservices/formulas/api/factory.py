from .constants import STAGE_DESCRIPTIONS, STAGE_NAMES
from .enums import Stage


def create_normalizer_url_key(stage):
    return (
        'NEGATION_NORMALIZER_LAMBDA_URL' if stage == Stage.ORIGINAL else
        'PRENEX_NORMALIZER_LAMBDA_URL' if stage == Stage.NNF else
        'CONJUNCTIVE_NORMALIZER_LAMBDA_URL' if stage == Stage.PNF else ''
    )

def create_step_one_key(stage, type):
    return (
        'negated_conclusion_' + type if stage == Stage.ORIGINAL else
        'standardized_' + type if stage == Stage.NNF else
        'dropped_quantifiers_' + type if stage == Stage.PNF else ''
    )

def create_step_two_key(stage, type):
    return (
        'removed_arrow_' + type if stage == Stage.ORIGINAL else
        'pre_quantifier_' + type if stage == Stage.NNF else
        'cnf_' + type if stage == Stage.PNF else ''
    )
    
def create_step_three_key(stage, type):
    return (
        'nnf_' + type if stage == Stage.ORIGINAL else
        'pnf_' + type if stage == Stage.NNF else
        'clauses_' + type if stage == Stage.PNF else ''
    )

def create_normalization_results(formulas):
    formulas_by_stage = {stage: [] for stage in range(0, 10)}
    for formula in formulas:
        formulas_by_stage[formula.stage].append(formula)

    results = []
    for stage, curr_formulas in enumerate(formulas_by_stage.values()):
        if stage == 0: continue
        stage_results = []
        for formula in curr_formulas:
            stage_results.append({
                'is_conclusion': formula.is_conclusion,
                'formula_result': formula.formula_result,
            })

        results.append({
            'stage': STAGE_NAMES[stage-1],
            'formulas': stage_results,
            'description': STAGE_DESCRIPTIONS[stage-1]
        })

    return results