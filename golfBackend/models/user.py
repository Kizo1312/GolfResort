from db import db

class UserModel(db.Model):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key= True)
  name = db.Column(db.String(50), unique = False, nullable = False)
  last_name = db.Column(db.String(50), unique = False, nullable = False)
  email = db.Column(db.String(100), unique = True, nullable = False)
  password = db.Column(db.String(100), unique = False, nullable = False)
  role = db.Column(db.String(20), nullable=False, default='guest')

  reservations = db.relationship("ReservationModel", back_populates="user", cascade="all, delete")