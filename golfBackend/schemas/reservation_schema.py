from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from models.reservation import ReservationModel
from .reservation_item_schema import ReservationItemSchema
from db import db
class ReservationSchema(SQLAlchemyAutoSchema):
    class Meta: #ova  meta zapravo automatski generira schemu
        model = ReservationModel  #tu joj kazemo da generira schemu iz ovog modela
        load_instance = True #ovo znaci da se nece generirati dictionary nego instanca tog modela
        include_fk = True # ovo samo ukljuci foreign keys u schemu
        sqla_session = db.session #nisam siguran, ali je obavezno kad imas load_instance = True

    reservation_items = fields.Nested(ReservationItemSchema, many=True, required=True)
    end_time = fields.Time(dump_only=True)

class EditReservationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ReservationModel
        load_instance = True
        include_fk = True
        sqla_session = db.session

    reservation_items = fields.Nested(ReservationItemSchema, many=True, required=False)
    end_time = fields.Time(dump_only=True)