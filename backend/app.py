import os
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask import Flask

load_dotenv()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:wzj20020407@localhost:5432/arist_lab"
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class UserModel(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())

    def __init__(self, name) -> None:
        self.name = name

    def __repr__(self) -> str:
        return f"<User {self.name}>"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
