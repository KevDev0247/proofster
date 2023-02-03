from ..config import db

class Formula(db.Model):
    __tablename__ = 'formula'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    content = db.Column(db.String)
    is_conclusion = db.Column(db.Boolean(), default=False)

    workspace_id = db.Column(
        db.Integer, 
        db.ForeignKey('workspace.id', ondelete='CASCADE'), 
        nullable=False
    )

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'content': self.content,
            'is_conclusion': self.is_conclusion
        }
