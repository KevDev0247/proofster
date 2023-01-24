from config import db

class Formula(db.Model):
    __tablename__ = 'formula'

    id = db.Column(db.Integer, primary_key=True)

    is_conclusion = db.Column(db.Boolean(), default=False)
    is_binary = db.Column(db.Boolean(), nullable=True, default=False)
    is_unary = db.Column(db.Boolean(), nullable=True, default=False)
    is_function = db.Column(db.Boolean(), nullable=True, default=False)
    is_variable = db.Column(db.Boolean(), nullable=True, default=False)
    has_atom_inside = db.Column(db.Boolean(), nullable=True, default=False)

    left = db.Column(db.BigInteger(), nullable=True)
    right = db.Column(db.BigInteger(), nullable=True)
    connective = db.Column(db.Integer(), nullable=True)

    quantifier = db.Column(db.Integer(), nullable=True)
    quantifier_variable = db.Column(db.BigInteger(), nullable=True)
    negation = db.Column(db.Boolean(), nullable=True)

    function_name = db.Column(db.String(), nullable=True)
    variable_name = db.Column(db.String(), nullable=True)

    inside = db.Column(db.BigInteger(), nullable=True)

    def to_json(self):
        return {
            'id': self.id,
            'is_conclusion': self.is_conclusion,
            'is_binary': self.is_binary,
            'is_unary': self.is_unary,
            'is_function': self.is_function,
            'is_variable': self.is_variable,
            'has_atom_inside': self.has_atom_inside,
            'left': self.left,
            'right': self.right,
            'connective': self.connective,
            'quantifier': self.quantifier,
            'quantifier_variable': self.quantifier_variable,
            'negation': self.negation,
            'function_name': self.function_name,
            'variable_name': self.variable_name,
            'inside': self.inside
        }

class Session(db.Model):
    __tablename__ = "session"

    id = db.Column(db.Integer, primary_key=True)
    formula = db.relationship(Formula)
