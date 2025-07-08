from flask.views import MethodView
from flask_smorest import Blueprint
from sqlalchemy import func
from db import db 
from models.service import ServiceModel 
from models.reservation import ReservationModel
from models.reservation_item import ReservationItemModel
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required
from utils import admin_required

blp = Blueprint("Analytics", __name__, description= "Operacije analitika")

@jwt_required()
@admin_required
@blp.route("/analytics/all-bookings")
class BookingsPerCourse(MethodView):
    def get(self):
        results = (
            db.session.query(ServiceModel.name, func.count(ReservationModel.id))
            .join(ReservationItemModel, ServiceModel.id == ReservationItemModel.service_id)
            .group_by(ServiceModel.name)
            .order_by(func.count(ReservationModel.id).desc())
            .all()
        )

        return [{"usluga": row[0], "broj bookinga": row[1]} for row in results]

@jwt_required()
@admin_required
@blp.route("/analytics/bookings-per-course")
class BookingsPerCourse(MethodView):
    def get(self):
        results = (
            db.session.query(ServiceModel.id, ServiceModel.name, func.count(ReservationItemModel.id))
            .join(ReservationItemModel, ServiceModel.id == ReservationItemModel.service_id)
            .filter(ServiceModel.category=="golf teren")
            .group_by(ServiceModel.id, ServiceModel.name)
            .order_by(func.count(ReservationItemModel.id).desc())
        )

        return [{"id": row[0], "name": row[1], "bookings": row[2]} for row in results]


@jwt_required()
@admin_required
@blp.route("/analytics/course/<int:course_id>")
class CourseStats(MethodView):
    def get(self, course_id):
        # Ukupan broj rezervacija za dati servis
        total = (
            db.session.query(func.count(ReservationItemModel.id))
            .join(ReservationModel, ReservationItemModel.reservation_id == ReservationModel.id)
            .filter(ReservationItemModel.service_id == course_id)
            .scalar()
        )

        # Najviše rezervisan sat - koristi start_time
        most_booked_hour = (
            db.session.query(func.extract("hour", ReservationModel.start_time), func.count(ReservationItemModel.id))
            .join(ReservationModel, ReservationItemModel.reservation_id == ReservationModel.id)
            .filter(ReservationItemModel.service_id == course_id)
            .group_by(func.extract("hour", ReservationModel.start_time))
            .order_by(func.count(ReservationItemModel.id).desc())
            .first()
        )

        # Najviše rezervisan dan u nedelji - koristi date
        most_booked_day = (
            db.session.query(func.extract("dow", ReservationModel.date), func.count(ReservationItemModel.id))
            .join(ReservationModel, ReservationItemModel.reservation_id == ReservationModel.id)
            .filter(ReservationItemModel.service_id == course_id)
            .group_by(func.extract("dow", ReservationModel.date))
            .order_by(func.count(ReservationItemModel.id).desc())
            .first()
        )

        days = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"]

        return {
            "total_bookings": total,
            "most_booked_hour": int(most_booked_hour[0]) if most_booked_hour else None,
            "most_booked_day": {
                "index": int(most_booked_day[0]),
                "name": days[int(most_booked_day[0])]
            } if most_booked_day else None
        }

@jwt_required()
@admin_required
@blp.route("/analytics/bookings-over-time")
class BookingsOverTime(MethodView):
    def get(self):
        start_date = datetime.now().date() - timedelta(days=30)

        results = (
            db.session.query(ReservationModel.date, func.count(ReservationModel.id))
            .filter(ReservationModel.date >= start_date)
            .group_by(ReservationModel.date)
            .order_by(ReservationModel.date)
            .all()
        )

        return [
            {"date": row[0].isoformat(), "count": row[1]}
            for row in results
        ]
    

@jwt_required()
@admin_required
@blp.route("/analytics/bookings-by-day")
class BookingsByDay(MethodView):
    def get(self):
        days = ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"]

        results = (
            db.session.query(
                func.extract("dow", ReservationModel.date).label("day_of_week"),
                func.count(ReservationModel.id)
            )
            .group_by("day_of_week")
            .order_by("day_of_week")
            .all()
        )

        return [
            {
                "day_index": int(row[0]),
                "day": days[int(row[0])],
                "count": row[1]
            }
            for row in results
        ]


@jwt_required()
@admin_required
@blp.route("/analytics/bookings-by-hour")
class BookingsByHour(MethodView):
    def get(self):
        results = (
            db.session.query(
                func.extract("hour", ReservationModel.start_time).label("hour"),
                func.count(ReservationModel.id)
            )
            .group_by("hour")
            .order_by("hour")
            .all()
        )

        return [
            {
                "hour": int(row[0]),
                "count": row[1]
            }
            for row in results
        ]