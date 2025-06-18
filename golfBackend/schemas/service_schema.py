from marshmallow import Schema, fields
from marshmallow.validate import OneOf

class ServiceSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    price = fields.Decimal(required=True)
    category = fields.Str(required=True, validate=OneOf(['golf teren', 'wellness', 'dodatna usluga']))
    description = fields.Str(required=False)
    inventory = fields.Int(required=True)


class EditServiceSchema(Schema):
    name= fields.Str(required=False)
    price= fields.Decimal(required=False)
    description = fields.Str(required=False)
    inventory= fields.Int(required=False)
    