from flask import Flask, request, jsonify
from flask.views import MethodView
from db import db
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort, Blueprint
from schemas import UserSchema, UserLoginSchema, EditUserSchema
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import (
    create_access_token, 
    get_jwt, 
    jwt_required,
    create_refresh_token,
    get_jwt_identity
)
from models.user import UserModel

blp = Blueprint("Users", __name__, description = "Operations on users")
@blp.route('/login')
class UserLogin(MethodView):
  @blp.arguments(UserLoginSchema)
  def post(self, user_data):
    user = UserModel.query.filter_by(email=user_data["email"]).first()
    if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=str(user.id))
           
            return {
                "message": "Login successful",
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "role": user.role
                }
            }, 200
    abort(401, message="Invalid credentials") 

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        existing = UserModel.query.filter_by(email=user_data["email"]).first()
        if existing:
            abort(409, message="User already exists")
        
        new_user = UserModel(
            name=user_data["name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            password=pbkdf2_sha256.hash(user_data["password"]),  
            role=user_data.get("role", "user")  
        )
        
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User created"}, 201

@blp.route("/users")
class UserList(MethodView):
    @blp.response(200, UserSchema(many=True))
    def get(self):
        return UserModel.query.all()
    



@blp.route('/users/<int:user_id>')
class User(MethodView):
    @blp.response(200, UserSchema)
    def get(self, user_id):
        user= UserModel.query.get_or_404(user_id)
        return user

    @blp.arguments(EditUserSchema)
    @blp.response(201, UserSchema)
    def put(self, user_data, user_id):
        user = UserModel.query.get_or_404(user_id)

        if user:
            user.name = user_data["name"]
            user.last_name = user_data["last_name"]
            user.email = user_data["email"]
            user.password = user_data["password"]
            user.role = user_data["role"]
            db.session.add(user)
            db.session.commit()
        return user 


    def delete(self, user_id):
        user= UserModel.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted."}