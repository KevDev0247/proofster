import unittest
from service import transpile

class Test(unittest.TestCase):
    def test_service(self):
        input = "FORM F y FORM G y AND FORM F x FORM G x -> OR EXIST y FORALL x".split()
        expected = "∀∃((F(y) ∧ G(y)) ∨ (F(x) ⇒ G(x)))"
        actual = transpile(input).to_string()
        self.assertEqual(actual, expected)