package utils

func CreateNormalizerUrlKey(stage int) string {
    switch stage {
    case int(ORIGINAL):
        return "NEGATION_NORMALIZER_LAMBDA_URL"
    case int(NNF):
        return "PRENEX_NORMALIZER_LAMBDA_URL"
    case int(PNF):
        return "CONJUNCTIVE_NORMALIZER_LAMBDA_URL"
    default:
        return ""
    }
}

func CreateStepOneKey(stage int, t string) string {
    switch stage {
    case int(ORIGINAL):
        return "negated_conclusion_" + t
    case int(NNF):
        return "standardized_" + t
    case int(PNF):
        return "dropped_quantifiers_" + t
    default:
        return ""
    }
}

func CreateStepTwoKey(stage int, t string) string {
    switch stage {
    case int(ORIGINAL):
        return "removed_arrow_" + t
    case int(NNF):
        return "pre_quantifier_" + t
    case int(PNF):
        return "cnf_" + t
    default:
        return ""
    }
}

func CreateStepThreeKey(stage int, t string) string {
    switch stage {
    case int(ORIGINAL):
        return "nnf_" + t
    case int(NNF):
        return "pnf_" + t
    case int(PNF):
        return "clauses_" + t
    default:
        return ""
    }
}