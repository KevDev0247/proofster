import unittest
from factory import create_formula_from_json
from service import transpile

class TestMyModule(unittest.TestCase):
    def test_service(self):
        input = "FORM F y FORM G y AND FORM F x FORM G x -> OR EXIST y FORALL x".split()
        expected = "∀∃((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        actual = transpile(input).to_string()
        self.assertEqual(actual, expected)

    def test_factory(self):
        input = "FORM F y FORM G y AND FORM F x FORM G x -> OR EXIST y FORALL x".split()
        formula = transpile(input)
        expected = formula.to_string()
        actual = create_formula_from_json(formula.to_json()).to_string()
        self.assertEqual(actual, expected)
