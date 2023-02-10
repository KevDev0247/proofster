import unittest
from factory import create_formula_from_json
from test_input import input

class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(input).to_string()
        expected = "∀∃((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        self.assertEqual(actual, expected)