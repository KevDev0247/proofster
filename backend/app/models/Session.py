from config import db

class Session(db.Model):
    __tablename__ = "session"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    # formula = db.relationship('Formula', backref='formula', lazy=True)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }
