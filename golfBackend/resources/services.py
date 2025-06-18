from flask import Flask, request, jsonify
from flask.views import MethodView
from db import db
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort, Blueprint
from schemas import ServiceSchema, EditServiceSchema
from flask_jwt_extended import jwt_required
from models.service import ServiceModel  

blp = Blueprint("Services", __name__, description="Operations on services")

@blp.route("/services")
class ServiceList(MethodView):

    
    @blp.arguments(ServiceSchema)
    @blp.response(201, ServiceSchema)
    def post(self, service_data):
        new_service = ServiceModel(
            name=service_data["name"],
            price=service_data["price"],
            category=service_data["category"],
            inventory=service_data["inventory"]
        )
        try:
            db.session.add(new_service)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while creating the service.")
        return new_service

    @blp.response(200, ServiceSchema(many=True))
    def get(self):
        return ServiceModel.query.all()
    
@blp.route("/services/<int:service_id>")
class Service(MethodView):
    @blp.response(200, ServiceSchema)
    def get(self, service_id):
        service= ServiceModel.query.get_or_404(service_id)
        return service
    
    @blp.arguments(EditServiceSchema)
    @blp.response(201, ServiceSchema)
    def put(self, service_data, service_id):
        service= ServiceModel.query.get_or_404(service_id)

        if service: 
            service.name = service_data["name"]
            service.price = service_data["price"]
            service.inventory = service_data["inventory"]
            db.session.add(service)
            db.session.commit()
        return service

    def delete(self, service_id):
        service = ServiceModel.query.get_or_404(service_id)
        db.session.delete(service)
        db.session.commit()
        return {"message": "Service deleted."}