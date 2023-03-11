package utils

type Stage int

const (
    ORIGINAL Stage = iota
    NEGATED_CONCLUSION
    REMOVED_ARROW
    NNF
    STANDARDIZED
    PRE_QUANTIFIER
    PNF
    DROPPED_QUANTIFIERS
    CNF
    CLAUSES
)