STAGE_NAMES = [
    "Negated Conclusion",
    "Removed Arrow",
    "NNF",
    "Standardized",
    "Pre-Quantifier",
    "PNF",
    "Dropped Quantifiers",
    "CNF",
    "Clauses"
]

STAGE_DESCRIPTIONS = [
    "We first negate the conclusion, which can be used later in resolution procedure. Like every proof by contradiction, you begin by assuming the opposite of what you wish to prove, and then show that this “fact” would lead to a contradiction.",
    "We then remove the arrows from our formulae, namely, eliminating implication (⇒) and biconditional implication (⇔). Syntactically, these symbols are not useful in resolution procedure, so we need to remove them from formulas.",
    "We now obtain the Negation Normal Form, where negation (¬) is only applied to variables and only conjunction (∧) and disjunction (∨) are allowed. This is end of negation normalization which helps us to further normalize into PNF.",
    "A very simple yet important step is Standardization where we standardize the variables apart by adding subscripts. This allows us to bring all the quantifiers to the front to avoid the clashing bound variable names for quantifiers.",
    "Then, we move all the quantifiers to the front. This is very simple on paper, however, to facilitate this programmatically, the algorithm has to traverse the entire formula's parse tree (binary tree) to obtain a list of all the quantifiers.",
    "Now, we can obtain the Prenex Normal Form, where it is written as a string of quantifiers and bound variables, called the prefix, followed by a quantifier-free part, called the matrix. Removing the quantifiers help us further normalize it.",
    "We simply drop all the quantifiers in front of the formula. One important sub step is called skolemization, where we remove all the existential quantifiers by substituting each occurrence of bound variable by a function of some variable.",
    "A very important step where we obtain the Conjunctive Normal Form of a formula --- conjunction of clauses. We do so by applying distributivity. One big challenge in the algorithm is handling a mix types of recursive calls for all formulas.",
    "The last step of preprocessing for resolution proofs is to generate clauses from CNF. It seems very straightforward, but programmatically it requires recursively traversing binary trees to populate clause and clause groups for each formula."
]