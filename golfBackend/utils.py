from models import UserModel
from flask_mail import Message
from flask import current_app
from flask_smorest import abort
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from extensions import mail

#Funkcija za uzimanje svih mailova od admina
def get_all_admin_mails():
    admins = UserModel.query.filter_by(role ="admin").all()
    return[admin.email for admin in admins]


#funkcija za slanje potvrde rezervacije useru i adminima
def confirmation_mail(to_mail,admin_mail, reservation, usluge):
    usluge_str = ", ".join(usluge)

    msg = Message(
        subject="Potvrda rezervacije -Golf Resort",
        sender= current_app.config["MAIL_USERNAME"],
        recipients=[to_mail],
        body=f"""
Poštovani,

uspješno ste rezervirali termin u Golf Resortu.
Usluge: {usluge_str}
Datum: {reservation.date}
Vrijeme: {reservation.start_time.strftime("%H:%M")}- {reservation.end_time.strftime('%H:%M')}
Trajanje: {reservation.duration_minutes} minuta

Zahvaljujemo na povjerenju!
"""
    )
    admin_msg = Message(
        subject="Obavijest o novoj rezervaciji - Golf Resort",
        sender= current_app.config["MAIL_USERNAME"],
        recipients= admin_mail,
        body=f"""
        Nova rezervacija je upravo izvršena.
Usluge: {usluge_str}
Datum: {reservation.date}
Vrijeme: {reservation.start_time.strftime("%H:%M")}- {reservation.end_time.strftime('%H:%M')}
Trajanje: {reservation.duration_minutes} minuta

Provjerite sustav za dodatne informacije.
"""
    )
    
    try:
        mail.send(msg)
        mail.send(admin_msg)
    except Exception as e:
        print("❌ Email sending failed:", e)
        abort(500, message="Reservation saved, but failed to send confirmation email.")

def cancelation_mail(to_mail,admin_mail, reservation, usluge):
    usluge_str = ", ".join(usluge)
    msg = Message(
        subject="Potvrda o otkazu rezervacije -Golf Resort",
        sender= current_app.config["MAIL_USERNAME"],
        recipients=[to_mail],
        body=f"""
Poštovani,

uspješno ste otkazali termin u Golf Resortu.
Usluge: {usluge_str}
Datum: {reservation.date}
Vrijeme: {reservation.start_time.strftime("%H:%M")}- {reservation.end_time.strftime('%H:%M')}
Trajanje: {reservation.duration_minutes} minuta

Zahvaljujemo na povjerenju!
"""
    )
    admin_msg = Message(
        subject="Obavijest o otkazivanju rezervacije - Golf Resort",
        sender= current_app.config["MAIL_USERNAME"],
        recipients= admin_mail,
        body=f"""
        Rezervacija upravo otkazana.
Usluge: {usluge_str}
Datum: {reservation.date}
Vrijeme: {reservation.start_time.strftime("%H:%M")}- {reservation.end_time.strftime('%H:%M')}
Trajanje: {reservation.duration_minutes} minuta

Provjerite sustav za dodatne informacije.
"""
    )
    
    try:
        mail.send(msg)
        mail.send(admin_msg)
        
    except Exception as e:
        print("❌ Email sending failed:", e)
        abort(500, message="Reservation saved, but failed to send confirmation email.")

def admin_required(fn):
    @wraps(fn)
    def wrapper(args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") != "admin":
            abort(403, description="Pristup dopušten samo administratorima!")
        return fn(args, **kwargs)
    return wrapper