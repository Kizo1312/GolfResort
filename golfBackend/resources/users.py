from flask import Flask, request, jsonify
from flask.views import MethodView
from db import db
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort, Blueprint
from schemas import UserSchema, UserLoginSchema, EditUserSchema, UserPublicSchema
from passlib.hash import pbkdf2_sha256
from utils import admin_required
from flask_jwt_extended import (
    create_access_token, 
    get_jwt, 
    jwt_required,
    create_refresh_token,
    get_jwt_identity
)
from models.user import UserModel
from datetime import timedelta
from models.blockedtokens import BlockedTokensModel

blp = Blueprint("Users", __name__, description = "Operations on users")
@blp.route('/login')
class UserLogin(MethodView):
  @blp.arguments(UserLoginSchema)
  def post(self, user_data):
    user = UserModel.query.filter_by(email=user_data["email"]).first()
    if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=str(user.id),additional_claims={"role": user.role}, expires_delta=timedelta(hours=1))
            refresh_token = create_refresh_token(identity=str(user.id))
           
            return {
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
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

        role = "user"
        new_user = UserModel(
            name=user_data["name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            password=pbkdf2_sha256.hash(user_data["password"]),
            role=role 
        )

        db.session.add(new_user)
        db.session.commit()

        return {"message": "User created"}, 201
    

@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        current_token = get_jwt()['jti']
        blocked_token = BlockedTokensModel(token=current_token)
        db.session.add(blocked_token)
        db.session.commit()
        return {"message": "User logged out."}, 200

@blp.route("/refresh")
class TokenRefresh(MethodView):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        current_token = get_jwt()['jti']
        blocked_token = BlockedTokensModel(token=current_token)
        db.session.add(blocked_token)
        db.session.commit()
        return {"access_token":new_token}, 200
    



@blp.route("/users")
class UserList(MethodView):
    @jwt_required()
    @admin_required
    @blp.response(200, UserPublicSchema(many=True))
    def get(self):
        
        return UserModel.query.all()

    

@blp.route('/users/<int:user_id>')
class User(MethodView):
    @jwt_required()
    @admin_required
    @blp.response(200, UserSchema)
    def get(self, user_id):
        user= UserModel.query.get_or_404(user_id)
        return user

    @blp.arguments(EditUserSchema)
    @blp.response(201, UserSchema)
    def put(self, user_data, user_id):
        user = UserModel.query.get_or_404(user_id)

        if user_data.get("name") is not None:
            user.name = user_data["name"]
        if user_data.get("last_name") is not None:
            user.last_name = user_data["last_name"]
        if user_data.get("email") is not None:
            user.email = user_data["email"]
        if user_data.get("password") is not None:
            user.password = user_data["password"]
        if user_data.get("role") is not None:
            user.role = user_data["role"]
        db.session.add(user)
        db.session.commit()
        return user 

    @admin_required
    @jwt_required()   
    def delete(self, user_id):
        
        user= UserModel.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted."}