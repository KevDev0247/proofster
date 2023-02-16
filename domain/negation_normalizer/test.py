import json
import unittest
from factory import create_formula_from_json
from test_input import premise_input, conclusion_input, event_input
from service import normalize, lambda_handler


class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(premise_input).to_string()
        expected = "∀x∃y((F(y) ∧ G(y)) ∨ ¬(F(x) ⇒ G(x)))"
        self.assertEqual(actual, expected)

    def test_negation_normalizer_service(self):
        premise = create_formula_from_json(premise_input)
        conclusion = create_formula_from_json(conclusion_input)

        response = normalize([premise, conclusion], is_proof=True)
        conclusion_actual = response['nnf_string'][1]
        premise_actual = response['nnf_string'][0]
        conclusion_expected = "∃xF(x)"
        premise_expected = "∀x∃y((F(y) ∧ G(y)) ∨ (F(x) ∧ ¬G(x)))"

        self.assertEqual(conclusion_actual, conclusion_expected)
        self.assertEqual(premise_actual, premise_expected)

    def test_lambda_handler(self):
        response = lambda_handler(event_input, None)
        premise_actual_str = json.loads(response['body'])['nnf_string'][0]
        premise_expected_str = "∀x∃y((F(y) ∧ G(y)) ∨ (F(x) ∧ ¬G(x)))"

        self.assertEqual(premise_actual_str, premise_expected_str)
