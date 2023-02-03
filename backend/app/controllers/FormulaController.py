from flask import jsonify, request, abort
from dependency_injector.wiring import inject, Provide
from ..app import db
from ..models.Formula import Formula
from ..containers import Container
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
    input_list = data['formula_raw'].split()
    formula_model = transpiler_service.transpile(input_list)
    formula_text = formula_model.to_string()

    formula = Formula(
        is_conclusion=data['is_conclusion'],
        name=data['name'],
        formula_text=formula_text,
        formula_raw=data['formula_raw'],
        workspace_id=data['workspace_id']
    )
    db.session.add(formula)
    db.session.commit()
    return jsonify(formula.to_json()), 201