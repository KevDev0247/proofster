from flask import jsonify, request, abort
from ..models.Workspace import Workspace
from ..app import db


def create_workspace():
    if not request.json:
        abort(400)

    data = request.get_json()
    workspace = Workspace(
        name=data['name'],
        user_id=data['user_id']
    )
    db.session.add(workspace)
    db.session.commit()
    return jsonify(workspace.to_json()), 201