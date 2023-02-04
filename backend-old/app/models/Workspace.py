from ..config import db

class Workspace(db.Model):
    __tablename__ = "workspace"

    id = db.Column(
        db.Integer, 
        primary_key=True
    )
    name = db.Column(db.String)

    formulas = db.relationship(
        'Formula', 
        backref='formula', 
        lazy=True
    )

    user_id = db.Column(
        db.Integer, 
        db.ForeignKey('user.id'), 
        nullable=False
    )

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id
        }
