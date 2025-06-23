from db import db
from datetime import datetime

class BlockedTokensModel(db.Model):
    __tablename__ = "blockedtokens"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)