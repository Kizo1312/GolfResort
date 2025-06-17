from marshmallow import Schema, fields

class ServiceSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    price = fields.Int(required=True)
    category = fields.Str(required=True)
    inventory = fields.Int(required=True)
