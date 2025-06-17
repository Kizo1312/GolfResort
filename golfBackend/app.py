from flask import Flask
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from resources.users import blp as UserBlueprint
from resources.services import blp as ServiceBlueprint

from flask_cors import CORS

from db import db  

load_dotenv()



app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///golf.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["API_TITLE"] = "Golf Resort API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"


db.init_app(app)
app.register_blueprint(UserBlueprint)
app.register_blueprint(ServiceBlueprint)


jwt = JWTManager(app)
api = Api(app)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)