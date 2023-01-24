from flask import jsonify, request, abort
from app import db
from models import Formula


def create_function_atom():
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

def create_function_function():
    if not request.is_json:
        abort(400)
    
    data = request.get_json()
    function = Formula(
        is_conclusion=False,
        is_function=True,
        has_atom_inside=False,
        function_name=data['function_name'],
        inside=data['inside']
    )
    db.session.add(function)
    db.session.commit()
    return jsonify(function.to_json()), 201

def create_binary():
    if not request.json():
        abort(400)

    data = request.get_json()
    binary = Formula(
        is_conclusion=False,
        is_binary=True,
        left=data['left'],
        right=data['right'],
        connective=data['connective']
    )
    db.session.add(binary)
    db.session.commit()
    return jsonify(binary.to_json()), 201

def create_unary():
    if not request.json():
        abort(400)

    data = request.get_json()
    unary = Formula(
        is_conclusion=False,
        is_unary=True,
        quantifier=data['quantifier'],
        quantifier_variable=data['quantifier_variable'],
        negation=data['negation']
    )
    db.session.add(unary)
    db.session.commit()
    return jsonify(unary.to_json()), 201

def index():
    return "<p>Hello, World!</p>"
