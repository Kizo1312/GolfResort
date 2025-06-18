from db import db

class ReservationItemModel(db.Model):
    __tablename__ = 'reservation_items'

    id = db.Column(db.Integer, primary_key=True)

    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)

    quantity = db.Column(db.Integer, nullable=False, default=1)  

    reservation = db.relationship("ReservationModel", back_populates="reservation_items")
    service = db.relationship("ServiceModel", back_populates="reservation_items")