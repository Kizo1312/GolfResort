from db import db

class ServiceModel(db.Model):
  __tablename__ = 'services'
  id = db.Column(db.Integer, primary_key= True)
  name = db.Column(db.String(50), unique = False, nullable = False)
  price = db.Column(db.Integer, nullable=False)
  category = db.Column(db.String(50), nullable=False)
  inventory = db.Column(db.Integer, nullable=False)
  
