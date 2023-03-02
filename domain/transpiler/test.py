import json
import unittest
from test_input import event_input
from service import lambda_handler, transpile, execute_shunting_yard


class Test(unittest.TestCase):
    def test_transpiler_service(self):
        input = "FORM F y FORM G y AND FORM F x FORM G x -> OR EXIST y FORALL x".split()
        expected = "∀x∃y((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        actual = transpile(input).to_string()
        self.assertEqual(actual, expected)

    def test_shunting_yard_service(self):
        input = "FORALL x EXIST y ( ( FORM F y AND FORM G y ) OR ( FORM F x -> FORM G x ) )".split()
        expected = ['FORM', 'F', 'y', 'FORM', 'G', 'y', 'AND', 'FORM', 'F', 'x', 'FORM', 'G', 'x', '->', 'OR', 'EXIST', 'y', 'FORALL', 'x']
        actual = execute_shunting_yard(input)
        self.assertEqual(actual, expected)

    def test_lambda_handler(self):
        response = lambda_handler(event_input, None)
        expected = "∀x∃y((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        actual = json.loads(response['body'])['formula_result']
        self.assertEqual(actual, expected)
        