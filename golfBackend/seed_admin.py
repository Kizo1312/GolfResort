from app import create_app
from db import db
from models.user import UserModel
from passlib.hash import pbkdf2_sha256

app = create_app()

with app.app_context():
    if not UserModel.query.filter_by(email="admin@example.com").first():
        admin = UserModel(
            name="Admin",
            last_name="User",
            email="admin@example.com",
            password=pbkdf2_sha256.hash("admin123"),
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user created.")
    else:
        print("Admin already exists.")


#python seed_admin.py