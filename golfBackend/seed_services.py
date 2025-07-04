from app import create_app
from db import db
from models.service import ServiceModel

app = create_app()

services = [
    {
        "id": 1,
        "name": "Zelena Dolina 9",
        "price": 30.00,
        "category": "golf teren",
        "description": "Smještena u idiličnom krajoliku blagih uspona i raskošne vegetacije...",
        "inventory": 1
    },
    {
        "id": 2,
        "name": "Orlov Greben 9",
        "price": 60.00,
        "category": "golf teren",
        "description": "Visoko na izduženom grebenu s pogledom koji oduzima dah...",
        "inventory": 1
    },
    {
        "id": 3,
        "name": "Kraljevski Borovi 18",
        "price": 45.00,
        "category": "golf teren",
        "description": "Smješten među veličanstvenim krošnjama stoljetnih borova...",
        "inventory": 1
    },
    {
        "id": 4,
        "name": "Pješčane Terase 18",
        "price": 60.00,
        "category": "golf teren",
        "description": "U okruženju koje podsjeća na mediteranske pustinjske pejzaže...",
        "inventory": 1
    },
    {
        "id": 5,
        "name": "Kristalno Jezero 9",
        "price": 35.00,
        "category": "golf teren",
        "description": "Smješten tik uz obalu bistrog jezera...",
        "inventory": 1
    },
    {
        "id": 6,
        "name": "Gorski Tok 9",
        "price": 32.00,
        "category": "golf teren",
        "description": "U srcu planinskog krajolika, među stijenama, potocima i visokim borovima...",
        "inventory": 1
    },
    {
        "id": 7,
        "name": "Zlatna Polja 18",
        "price": 50.00,
        "category": "golf teren",
        "description": "Prostirući se kroz valovitu panoramu suncem okupanih livada...",
        "inventory": 1
    },
    {
        "id": 8,
        "name": "Mirna Dolina 9",
        "price": 27.00,
        "category": "golf teren",
        "description": "Uvučen među tihe obronke i nježno valovite ravnice...",
        "inventory": 1
    },
    {
        "id": 9,
        "name": "Najam palica",
        "price": 20.00,
        "category": "dodatna usluga",
        "description": "Najam kompleta standardnih golf palica za vrijeme igre.",
        "inventory": 10
    },
    {
        "id": 10,
        "name": "Najam kolica",
        "price": 10.00,
        "category": "dodatna usluga",
        "description": "Električna kolica za dvije osobe, dostupna po satu.",
        "inventory": 10
    },
    {
        "id": 11,
        "name": "Privatni instruktor",
        "price": 50.00,
        "category": "dodatna usluga",
        "description": "Jednosatna individualna poduka s profesionalnim instruktorom.",
        "inventory": 5
    },
    {
        "id": 12,
        "name": "Masaža cijelog tijela",
        "price": 40.00,
        "category": "wellness",
        "description": "Opuštajuća masaža cijelog tijela u trajanju od 60 minuta...",
        "inventory": 1
    },
    {
        "id": 13,
        "name": "Sauna – Privatni termin",
        "price": 20.00,
        "category": "wellness",
        "description": "Sauna pruža duboku detoksikaciju i opuštanje tijela...",
        "inventory": 1
    },
    {
        "id": 14,
        "name": "Aromaterapija",
        "price": 40.00,
        "category": "wellness",
        "description": "Aromaterapija koristi moć eteričnih ulja za duboku relaksaciju...",
        "inventory": 1
    }
]

with app.app_context():
    for data in services:
        existing = db.session.get(ServiceModel, data["id"])
        if not existing:
            service = ServiceModel(**data)
            db.session.add(service)
    db.session.commit()
    print("✅ Services successfully inserted.")
