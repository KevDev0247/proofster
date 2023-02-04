from flask import jsonify, request, abort
from dependency_injector.wiring import inject, Provide
from ..app import db
from ..models.Formula import Formula
from ..containers import Container
import sys
sys.path.append("C:\\Users\\Kevin\\Projects\\arist-labs\\backend")
from domain.services.TranspilerService import TranspilerService


# helper function to transpile raw input into first order logic formula
@inject
def transpile_to_fol(
    raw: str, 
    transpiler_service: TranspilerService = Provide[Container.transpiler_service]
) -> str:
    input_list = raw.split()
    formula_model = transpiler_service.transpile(input_list)
    return formula_model.to_string()

def create_formula():
    if not request.is_json:
        abort(400)
    data = request.get_json()

    formula = Formula(
        is_conclusion=data['is_conclusion'],
        name=data['name'],
        formula_text=transpile_to_fol(
            data['formula_raw']
        ),
        formula_raw=data['formula_raw'],
        workspace_id=data['workspace_id']
    )
    db.session.add(formula)
    db.session.commit()
    return jsonify(formula.to_json()), 201

def update_formula(formula_id: int):
    if not request.is_json:
        abort(400)
    
    formula = Formula.query.get(formula_id)
    if formula is None:
        abort(400)
    formula.name = request.json.get('name', formula.name)
    formula.formula_raw = request.json.get('formula_raw', formula.formula_raw)

    if 'formula_raw' in request.json:
        formula.formula_text = transpile_to_fol(
            formula.formula_raw
        )

    db.session.commit()
    return jsonify(formula.to_json())

def get_formulas_by_workspace():
    workspace_id = request.args.get('workspace_id', None)
    formulas = Formula.query.filter(
        Formula.workspace_id == workspace_id
    ).all()

    return jsonify([formula.to_json() for formula in formulas])

def delete_formula(formula_id: int):
    formula = Formula.query.get(formula_id)
    if formula is None:
        abort(400)

    db.session.delete(formula)
    db.session.commit()    
    return jsonify({'result': True})
