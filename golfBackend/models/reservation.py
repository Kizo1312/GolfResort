
from db import db
from datetime import datetime

class ReservationModel(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("UserModel", back_populates="reservations")
    reservation_items = db.relationship("ReservationItemModel", back_populates="reservation", cascade="all, delete") 
