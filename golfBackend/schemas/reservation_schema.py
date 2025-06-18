from marshmallow import Schema, fields, validates, ValidationError
from datetime import date, time

class ReservationItemSchema(Schema):
    service_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=lambda x: x > 0)

class ReservationSchema(Schema):
    date = fields.Date(required=True)  
    start_time = fields.Time(required=True)  
    duration_minutes = fields.Int(required=True, validate=lambda x: x > 0)
    items = fields.List(fields.Nested(ReservationItemSchema), required=True, validate=lambda l: len(l) > 0)