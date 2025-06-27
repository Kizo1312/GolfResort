from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from models.reservation_item import ReservationItemModel
from .service_schema import ServiceSchema
from db import db
from marshmallow import fields

class ReservationItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ReservationItemModel
        load_instance = True
        include_fk = True
        sqla_session = db.session


    reservation_id = auto_field(dump_only=True)
    service = fields.Nested(ServiceSchema, dump_only=True)
    price_at_booking = auto_field(dump_only=True)