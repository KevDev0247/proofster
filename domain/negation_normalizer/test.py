import unittest
from factory import create_formula_from_json
from test_input import premise_input, conclusion_input
from service import normalize


class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(premise_input).to_string()
        expected = "∀x∃y((F(y) ∧ G(y)) ∨ ¬(F(x) ⇒ G(x)))"
        self.assertEqual(actual, expected)

    def test_negation_normalizer_service(self):
        premise = create_formula_from_json(premise_input)
        conclusion = create_formula_from_json(conclusion_input)

        normalized_argument = normalize([premise, conclusion], is_proof=True).to_string()
        conclusion_actual = normalized_argument[1]
        premise_actual = normalized_argument[0]
        conclusion_expected = "∃xF(x)"
        premise_expected = "∀x∃y((F(y) ∧ G(y)) ∨ (F(x) ∧ ¬G(x)))"

        self.assertEqual(conclusion_actual, conclusion_expected)
        self.assertEqual(premise_actual, premise_expected)
