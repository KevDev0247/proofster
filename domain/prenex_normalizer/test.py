import unittest
from factory import create_formula_from_json
from test_input import input
from service import Normalizer

class Test(unittest.TestCase):
    def test_formula_factory(self):
        actual = create_formula_from_json(input).to_string()
        expected = "∀∃((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        self.assertEqual(actual, expected)

    def test_prenex_normalizer_service(self):
        formula = create_formula_from_json(input)
        normalizer = Normalizer([formula])

        normalizer.normalize_to_prenex()
        actual = normalizer.to_string().pop()
        expected = "∀x1((F(f(x1)) ∧ G(f(x1))) ∨ (¬F(x1) ∨ G(x1)))"
        self.assertEqual(actual, expected)