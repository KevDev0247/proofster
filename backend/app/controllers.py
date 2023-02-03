from flask import jsonify, request, abort
from .app import db
from .containers import Container
from .models.Workspace import Workspace
from .models.Formula import Formula
from dependency_injector.wiring import inject, Provide
import sys
sys.path.append("C:\\Users\\Kevin\\Projects\\arist-labs\\backend")
from domain.services.TranspilerService import TranspilerService


@inject
def create_formula(
    transpiler_service: TranspilerService = Provide[Container.transpiler_service]
):
    if not request.is_json:
        abort(400)

    data = request.get_json()
    input_list = data['content'].split()
    formula_model = transpiler_service.transpile(input_list)
    content = formula_model.to_string()

    formula = Formula(
        is_conclusion=data['is_conclusion'],
        name=data['name'],
        content=content
    )
    db.session.add(formula)
    db.session.commit()
    return jsonify(formula.to_json()), 201


def create_workspace():
    if not request.json:
        abort(400)

    data = request.get_json()
    workspace = Workspace(name=data['name'])
    db.session.add(workspace)
    db.session.commit()
    return jsonify(workspace.to_json()), 201

def index():
    return "<p>Hello, World!</p>"
