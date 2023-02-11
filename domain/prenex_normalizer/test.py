import unittest
from factory import create_formula_from_json
from test_input import premise_input, conclusion_input
from service import normalize_and_save


class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(premise_input).to_string()
        expected = "∀∃((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        self.assertEqual(actual, expected)

    def test_prenex_normalizer_service(self):
        premise = create_formula_from_json(premise_input)
        conclusion = create_formula_from_json(conclusion_input)

        normalized_argument = normalize_and_save([premise, conclusion])
        conclusion_actual = normalized_argument[1]
        premise_actual = normalized_argument[0]
        conclusion_expected = "F(u)"
        premise_expected = "∀x1((F(f(x1)) ∧ G(f(x1))) ∨ (¬F(x1) ∨ G(x1)))"

        self.assertEqual(conclusion_actual, conclusion_expected)
        self.assertEqual(premise_actual, premise_expected)
