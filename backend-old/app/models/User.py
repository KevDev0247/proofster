from ..config import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(
        db.Integer, 
        primary_key=True
    )
    email = db.Column(
        db.String, 
        unique=True, 
        nullable=False
    )
    password = db.Column(
        db.String, 
        nullable=False
    )

    workspaces = db.relationship(
        'Workspace', 
        backref='workspace', 
        lazy=True
    )

    def set_password(self, password):
        self.password = generate_password_hash(
            password,
            method="sha256"
        )

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_json(self):
        return {
            'id': self.id,
            'email': self.email,
            'password': self.password
        }
