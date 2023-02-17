from enum import Enum

class Stage(Enum):
    ORIGINAL = 0
    NEGATED_CONCLUSION = 1
    REMOVED_ARROW = 2
    NNF = 3
    STANDARDIZED = 4
    PRE_QUANTIFIER = 5
    PNF = 6
    DROPPED_QUANTIFIERS = 7
    CNF = 8
    CLAUSES = 9
