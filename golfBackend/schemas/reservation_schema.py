from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from models.reservation import ReservationModel
from .reservation_item_schema import ReservationItemSchema
from db import db
class ReservationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ReservationModel
        load_instance = True
        include_fk = True
        sqla_session = db.session

    reservation_items = fields.Nested(ReservationItemSchema, many=True, required=True)
    end_time = fields.Time(dump_only=True)
