from ..config import db

class Formula(db.Model):
    __tablename__ = 'formula'

    id = db.Column(
        db.Integer, 
        primary_key=True
    )
    is_conclusion = db.Column(
        db.Boolean(), 
        default=False
    )
    name = db.Column(db.String)
    formula_text = db.Column(db.String)
    formula_raw = db.Column(db.String)
    
    workspace_id = db.Column(
        db.Integer, 
        db.ForeignKey('workspace.id', ondelete='CASCADE'), 
        nullable=False
    )

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'formula_text': self.formula_text,
            'formula_raw': self.formula_raw,
            'is_conclusion': self.is_conclusion
        }
