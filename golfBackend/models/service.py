from db import db
from sqlalchemy import CheckConstraint

class ServiceModel(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    inventory = db.Column(db.Integer, nullable=False)

    reservation_items = db.relationship("ReservationItemModel", back_populates="service")

    __table_args__ = (
        CheckConstraint(
            "category IN ('golf teren', 'wellness', 'dodatna usluga')",
            name='check_services_category'
        ),
    )
  