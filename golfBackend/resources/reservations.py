from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_, func
from datetime import datetime, timedelta
from sqlalchemy.orm import joinedload
from db import db
from models.reservation import ReservationModel
from models.reservation_item import ReservationItemModel
from schemas import ReservationSchema
from models.service import ServiceModel
from models.user import UserModel
from flask_mail import Message
from flask import current_app
from utils import get_all_admin_mails
from extensions import mail
from utils import admin_required
from utils import confirmation_mail, cancelation_mail





blp = Blueprint("Reservations", __name__, description="Operations on reservations")

@blp.route("/reservations")
class CreateReservation(MethodView):
    @jwt_required()
    
    @blp.arguments(ReservationSchema(session=db.session))
    @blp.response(201, ReservationSchema)
    def post(self, reservation_data):
        current_user_id = int(get_jwt_identity())
        claims = get_jwt()

        reservation_data.user_id = current_user_id

        user_id = reservation_data.user_id
        date = reservation_data.date
        start_time = reservation_data.start_time
        duration = reservation_data.duration_minutes

        
        end_time = (datetime.combine(date, start_time) + timedelta(minutes=duration)).time()
        reservation_data.end_time = end_time
        

        service_names = []
        for item in reservation_data.reservation_items:
            service_id = item.service_id
            requested_quantity = item.quantity
            service = db.session.get(ServiceModel, service_id)
            service_names.append(service.name)

            item.price_at_booking = service.price

            
            overlapping_query = (
                db.session.query(ReservationModel)
                .join(ReservationItemModel)
                .filter(
                    ReservationItemModel.service_id == service_id,
                    ReservationModel.date == date,
                    ReservationModel.start_time < end_time,
                    ReservationModel.end_time > start_time
                )
            )

            if service.category in ["golf teren", "wellness"]:
                
                if overlapping_query.first():
                    abort(409, message=f"Service ID {service_id} is already reserved during this time.")
            else:
                
                overlapping_reservations = overlapping_query.all()

                total_reserved = 0
                for reservation in overlapping_reservations:
                    for res_item in reservation.reservation_items:
                        if res_item.service_id == service_id:
                            total_reserved += res_item.quantity

                if total_reserved + requested_quantity > service.inventory:
                    abort(409, message=f"Not enough inventory for service ID {service_id} at the selected time.")

       
        try:
            db.session.add(reservation_data)
            db.session.commit()
            user = db.session.get(UserModel,user_id)
            admin_mails = get_all_admin_mails()
            confirmation_mail(user.email, admin_mails, reservation_data, service_names)

        except SQLAlchemyError as e:
            db.session.rollback()
            print("Error:", e)
            abort(500, message="An error occurred while creating the reservation.")

        
        return reservation_data
    
    @jwt_required()
    @admin_required
    @blp.response(200, ReservationSchema(many=True))
    def get(self):
        print("🔍 Reservation GET endpoint triggered")

        reservations = ReservationModel.query.options(
            joinedload(ReservationModel.reservation_items).joinedload(ReservationItemModel.service)
        ).all()
        for r in reservations:
          print("Reservation:", r.id)
          for item in r.reservation_items:
              print(" - Item:", item.service_id, "Service:", item.service.name if item.service else None)


        return reservations

@blp.route("/reservations/<int:reservation_id>")
class ReservationOperations(MethodView):
    @jwt_required()
    def delete(self, reservation_id):
        reservation = ReservationModel.query.get_or_404(reservation_id)
        if not reservation.reservation_items:
            abort (404, message="Nisu pronađene usluge za ovu rezervaciju.")

        current_user_id = int(get_jwt_identity())
        claims = get_jwt() 

        if reservation.user_id != current_user_id and claims.get("role") != "admin":
            abort(403, message="Možete otkazati samo vlastitu rezervaciju.")  

        user_id=reservation.user_id
        service_names=[]
        for item in reservation.reservation_items:
            service_id = item.service_id
            service = db.session.get(ServiceModel, service_id)
            service_names.append(service.name)
        try:
            user= db.session.get(UserModel, user_id)
            admin_mails= get_all_admin_mails()
            cancelation_mail(user.email, admin_mails, reservation, service_names)
            db.session.delete(reservation)
            db.session.commit()
            return {"message": "Rezervacija uspješno otkazana."}
        except SQLAlchemyError:
            abort(500, message="Došlo je do greške prilikom otkazivanja rezervacije. Pokušajte ponovno.")

    @jwt_required()
    @admin_required
    def put(self,updated_data, reservation_id):
        reservation = ReservationModel.query.get_or_404(reservation_id)
        date = updated_data.date
        start_time = updated_data.start_time
        duration = updated_data.duration_minutes
        end_time = (datetime.combine(date, start_time) + timedelta(minutes=duration)).time()
        updated_data.end_time = end_time

        for item in updated_data.reservation_items:
            service_id = item.service_id
            requested_quantity = item.quantity
            #service_name = service.name if service else f"ID {item.service_id}"
            service = db.session.get(ServiceModel, service_id)

            overlapping_query = (
                db.session.query(ReservationModel)
                .join(ReservationItemModel)
                .filter(
                    ReservationItemModel.service_id == service_id,
                    ReservationModel.date == date,
                    ReservationModel.start_time < end_time,
                    ReservationModel.end_time > start_time,
                    ReservationModel.id != reservation_id


                )

            )
            if service.category in ["golf teren", "wellness"]:
                if overlapping_query.first():
                    abort(409, message =f"Usluga  {service_id} is already reserved during this time.")
            else:
                overlapping_reservations = overlapping_query.all()
                total_reserved = 0
                for r in overlapping_reservations:
                    for res_item in r.reservation_items:
                        if res_item.service_id == service_id:
                            total_reserved += res_item.quantity
                    
                if total_reserved + requested_quantity > service.inventory:
                    abort(409, message=f"Not enough inventory for service {service_id} at the selected time.")

                    
            try:
                ReservationItemModel.query.filter_by(reservation_id=reservation.id).delete()
                
                reservation.date = date
                reservation.start_time = start_time
                reservation.end_time = end_time
                reservation.duration_minutes = duration
                

                new_items = []
                for item in updated_data.reservation_items:
                    item.reservation = reservation
                    new_items.append(item)
                reservation.reservation_items = new_items
                db.session.commit()

            except SQLAlchemyError as e:
                db.session.rollback()
                print("Error", e)
                abort(500, message="An error occurred while updating the reservation.")
            return reservation



from flask import request
from datetime import datetime

@blp.route("/reservations/by-date/<string:date_str>")
class ReservationByDate(MethodView):
    @jwt_required()
    @admin_required
    @blp.response(200, ReservationSchema(many=True))
    def get(self, date_str):
        try:
            # Expecting format like "2025-06-23"
            search_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            abort(400, message="Invalid date format. Use YYYY-MM-DD.")
        
        reservations = ReservationModel.query.options(
            joinedload(ReservationModel.reservation_items).joinedload(ReservationItemModel.service)
        ).filter(ReservationModel.date == search_date).all()

        if not reservations:
            abort(404, message=f"No reservations found for date {date_str}.")
        
        return reservations
    
@blp.route("/reservations/by-user/<int:user_id>")
class ReservationByUserId(MethodView):
    @jwt_required()
    @blp.response(200, ReservationSchema(many=True))
    def get(self, user_id):
        current_user_id = int(get_jwt_identity())
        claims = get_jwt()

        print("current_user_id:", current_user_id)
        print("user_id from URL:", user_id)
        print("claims:", claims)

        if user_id != current_user_id and claims.get("role") != "admin":
            abort(403, message="možete pristupiti samo svojim rezervacijama.")


        user= UserModel.query.get_or_404(user_id)

        reservations = ReservationModel.query.options(
            joinedload(ReservationModel.reservation_items).joinedload(ReservationItemModel.service)
        ).filter(ReservationModel.user_id == user.id).all()

        if not reservations: 
            abort(404, message=f"No reservations found for user {user_id}.")
        
        return reservations

@blp.route("/reservations/by-category/<service_category>")
class ReservationByCategory(MethodView):
    @jwt_required()
    @admin_required
    @blp.response(200, ReservationSchema(many=True))
    def get(self, service_category):
        reservations = (
            ReservationModel.query
            .join(ReservationModel.reservation_items)
            .join(ReservationItemModel.service)
            .filter(ServiceModel.category == service_category)
            .options(
                joinedload(ReservationModel.reservation_items)
                .joinedload(ReservationItemModel.service)
            )
            .all()
        )

        if not reservations:
            abort(404, message =f"No reservations found for category '{service_category}'.")
        
        return reservations
       
