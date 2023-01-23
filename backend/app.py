import os
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask import Flask, abort, jsonify, request
from config import configure_db, db
from models import Formula

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:wzj20020407@localhost:5432/arist_lab"
configure_db(app)
migrate = Migrate(app, db)


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
def index():
    return "<p>Hello, World!</p>"
