import os
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask import Flask, abort, jsonify, request

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:wzj20020407@localhost:5432/arist_lab"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

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
    # formula = db.relationship(Formula)

@app.route('/function-atom', methods=['POST'])
def create_function():
    if not request.is_json:
        abort(400)
    
    data = request.get_json()
    function = Formula(
        is_conclusion=False,
        is_function=True,
        has_atom_inside=True,
        function_name=data['function_name'],
        variable_name=data['variable_name'],
    )
    db.session.add(function)
    db.session.commit()
    return jsonify(function.to_json()), 201

@app.route('/binary', methods=['POST'])
def create_binary():
    if not request.json():
        abort(400)

    # need a factory
    binary = Formula(
        is_conclusion=False,
        is_binary=True,
        
    )

    db.session.add(binary)
    db.session.commit()

@app.route('/formula', methods=['GET'])
def get_formulas():
    pass                                                                                                                                                   

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
