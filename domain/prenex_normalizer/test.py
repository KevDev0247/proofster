import json
import unittest
from factory import create_formula_from_json
from test_input import premise_input, event_input
from service import normalize, lambda_handler


class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(premise_input).to_string()
        expected = "∀x∃y((F(y) ∧ G(y)) ∨ (F(x) ∧ ¬G(x)))"
        self.assertEqual(actual, expected)

    def test_prenex_normalizer_service(self):
        premise = create_formula_from_json(premise_input)

        response = normalize([premise])
        premise_actual = response['pnf_string'][0]
        premise_expected = "∀x1((F(f(x1)) ∧ G(f(x1))) ∨ (F(x1) ∧ ¬G(x1)))"

        self.assertEqual(premise_actual, premise_expected)

    def test_lambda_handler(self):
        response = lambda_handler(event_input, None)
        premise_actual_str = json.loads(response['body'])['pnf_string'][0]
        premise_expected_str = "∀x1((F(f(x1)) ∧ G(f(x1))) ∨ (F(x1) ∧ ¬G(x1)))"

        self.assertEqual(premise_actual_str, premise_expected_str)
