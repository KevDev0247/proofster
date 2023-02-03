from ..config import db

class Workspace(db.Model):
    __tablename__ = "workspace"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    formulas = db.relationship(
        'Formula', 
        backref='formula', 
        lazy=True
    )

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }
