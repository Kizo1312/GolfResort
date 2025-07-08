from flask import Flask
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from resources.users import blp as UserBlueprint
from resources.services import blp as ServiceBlueprint
from resources.reservations import blp as RegistrationBlueprint
from resources.analytics import blp as AnalyticsBlueprint
from dotenv import load_dotenv
from flask_mail import Mail
from extensions import mail
from flask_cors import CORS

from db import db
load_dotenv()


load_dotenv()

def create_app(db_url=None):
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
    
    print("Connected to DB:", app.config["SQLALCHEMY_DATABASE_URI"])



    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["API_TITLE"] = "Golf Resort API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_SESSION"] = db.session

    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME") 
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

    mail.init_app(app)



    db.init_app(app)
    app.register_blueprint(UserBlueprint)
    app.register_blueprint(ServiceBlueprint)
    app.register_blueprint(RegistrationBlueprint)
    app.register_blueprint(AnalyticsBlueprint)


    jwt = JWTManager(app)
    api = Api(app)

    with app.app_context():
        db.create_all()


    return app



#source venv/Scripts/activate