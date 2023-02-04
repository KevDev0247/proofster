from flask import jsonify, request, abort
from ..app import db
from ..models.User import User


def register():
    if not request.json:
        abort(400)
    
    data = request.get_json()
    existing_user = User.query.filter_by(email=data['email']).first()

    if existing_user is None:
        user = User(
            email=data['email'],
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_json()), 201
    else:
        return jsonify({'error': 'User already existed!'}), 403

def login():
    pass

def logout():
    pass
