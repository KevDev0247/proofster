import json
import unittest
from normalizer import clause_to_string
from factory import create_formula_from_json
from test_input import premise_input, event_input
from service import normalize, lambda_handler, generate_clauses


class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(premise_input).to_string()
        expected = "((F(f(x1)) ∧ G(f(x1))) ∨ (F(x1) ∧ ¬G(x1)))"
        self.assertEqual(actual, expected)

    def test_conjunctive_normalizer_service(self):
        premise = create_formula_from_json(premise_input)

        normalizer, response = normalize([premise])
        premise_actual = response['cnf_string'][0]
        premise_expected = "(((F(f(x1)) ∨ F(x1)) ∧ (F(f(x1)) ∨ ¬G(x1))) ∧ ((G(f(x1)) ∨ F(x1)) ∧ (G(f(x1)) ∨ ¬G(x1))))"

        self.assertEqual(premise_actual, premise_expected)

    def test_clause_generation(self):
        premise = create_formula_from_json(premise_input)

        normalizer, response = normalize([premise])
        clauses = generate_clauses(normalizer)
        clauses_actual_str = clause_to_string(clauses[0])
        clauses_expected_str = "F(f(x1)) ∨ F(x1), F(f(x1)) ∨ ¬G(x1), G(f(x1)) ∨ F(x1), G(f(x1)) ∨ ¬G(x1)"

        self.assertEqual(clauses_actual_str, clauses_expected_str)

    def test_lambda_handler(self):
        response = lambda_handler(event_input, None)
        premise_actual_str = json.loads(response['body'])['cnf_string'][0]
        premise_expected_str = "(((F(f(x1)) ∨ F(x1)) ∧ (F(f(x1)) ∨ ¬G(x1))) ∧ ((G(f(x1)) ∨ F(x1)) ∧ (G(f(x1)) ∨ ¬G(x1))))"

        self.assertEqual(premise_actual_str, premise_expected_str)
