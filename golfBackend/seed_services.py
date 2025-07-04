from app import create_app
from db import db
from models.service import ServiceModel

app = create_app()

services = [
    # --- Golf tereni ---
    {
        "id": 1,
        "name": "Zelena Dolina 9",
        "price": 30.00,
        "category": "golf teren",
        "description": "Smještena u idiličnom krajoliku blagih uspona i raskošne vegetacije, Zelena Dolina 9 nudi jedinstveno golf iskustvo u savršenom skladu s prirodom. Ovaj scenski teren s devet rupa vodi igrače kroz slikovite pejzaže, gdje se fairwayi nježno uvijaju među zelenim brežuljcima i prirodnim livadama. Svaka rupa pažljivo je oblikovana kako bi pružila lagani izazov, ali i maksimalan užitak svim igračima, bez obzira na razinu iskustva. Zelena Dolina nije samo ime – to je osjećaj smirenosti i svježine koji prati svaki korak na terenu. Uživanje u igri ovdje dolazi prirodno, okruženo bogatstvom boja, zvukova i mirisa netaknute prirode.",
        "inventory": 1
    },
    {
        "id": 2,
        "name": "Orlov Greben 9",
        "price": 60.00,
        "category": "golf teren",
        "description": "Visoko na izduženom grebenu s pogledom koji oduzima dah, Orlov Greben 9 poziva iskusne golfere na tehnički zahtjevniju igru. Ovaj teren s devet rupa poznat je po preciznim linijama, promišljeno postavljenim preprekama i terenima koji nagrađuju strateški pristup. Idealno mjesto za vježbu kratke igre, ali i testiranje koncentracije, Orlov Greben zahtijeva mirnu ruku i jasno oko. Okružen stjenovitim obroncima i divljim raslinjem, svaki udarac ovdje nosi dozu uzbuđenja i osjećaj osvajanja visina – baš poput leta orla čije ime teren ponosno nosi.",
        "inventory": 1
    },
    {
        "id": 3,
        "name": "Kraljevski Borovi 18",
        "price": 45.00,
        "category": "golf teren",
        "description": "Smješten među veličanstvenim krošnjama stoljetnih borova, golf teren Kraljevski Borovi predstavlja savršeni spoj prirodne ljepote, vrhunske arhitekture i sportske elegancije. Ovaj ekskluzivni teren proteže se kroz valovite brežuljke, šumske proplanke i mirne vodene površine, stvarajući izazovno, ali izuzetno ugodno okruženje za golfere svih razina. S pažljivo dizajniranim fairwayima i besprijekorno održavanim greenovima, svaki udarac na Kraljevskim Borovima postaje posebno iskustvo. Ime nije slučajno – borovi koji okružuju teren daju ne samo prirodnu hladovinu, već i osjećaj kraljevskog dostojanstva, mira i povratka prirodi.",
        "inventory": 1
    },
    {
        "id": 4,
        "name": "Pješčane Terase 18",
        "price": 60.00,
        "category": "golf teren",
        "description": "U okruženju koje podsjeća na mediteranske pustinjske pejzaže, Pješčane Terase 18 predstavljaju izazov za odlučne i tehnički spremne igrače. Ovaj teren s osamnaest rupa oblikovan je kroz blage terasaste padine i pješčane zone koje dominiraju vizurom, dok brzi greenovi i promjenjivi vjetrovi dodatno testiraju preciznost. Igrači ovdje moraju promišljati svaki udarac, jer teren ne oprašta pogreške, ali velikodušno nagrađuje hrabrost i vještinu. Pješčane Terase su dinamične, uzbudljive i dramatične – savršen odabir za one koji vole igru punu karaktera.",
        "inventory": 1
    },
    {
        "id": 5,
        "name": "Kristalno Jezero 9",
        "price": 35.00,
        "category": "golf teren",
        "description": "Smješten tik uz obalu bistrog jezera, Kristalno Jezero 9 nudi opuštenu i ugodnu atmosferu za golfere koji cijene mir, jednostavnost i čistoću igre. Ovaj teren s devet rupa dizajniran je s naglaskom na pristupačnost, čineći ga idealnim za početnike, rekreativce i sve koji žele uživati u igri bez pritiska. Nježni fairwayi, lagane prepreke i refleksije vode stvaraju osjećaj harmonije između igre i prirode. Kristalno Jezero nije samo naziv – to je odraz duha terena, gdje svaki zamah dolazi s lakoćom, a svaki pogled smiruje um.",
        "inventory": 1
    },
    {
        "id": 6,
        "name": "Gorski Tok 9",
        "price": 32.00,
        "category": "golf teren",
        "description": "U srcu planinskog krajolika, među stijenama, potocima i visokim borovima, smjestio se Gorski Tok 9 – teren koji povezuje divlju prirodu i sportsku preciznost. Ovaj teren s devet rupa karakteriziraju neravni tereni, prirodne prepreke i stalna interakcija s planinskim reljefom. Igrači se susreću s promjenama visine, stjenovitim rubovima i uskim fairwayima koji zahtijevaju prilagodbu i dobru kontrolu igre. Svaki udarac na Gorskom Toku nosi autentičnost i avanturistički duh – pravo mjesto za one koji žele golf doživjeti na potpuno nov način, u suživotu s planinskom snagom prirode.",
        "inventory": 1
    },
    {
        "id": 7,
        "name": "Zlatna Polja 18",
        "price": 50.00,
        "category": "golf teren",
        "description": "Prostirući se kroz valovitu panoramu suncem okupanih livada, Zlatna Polja 18 predstavljaju klasični golf doživljaj u svojem najčišćem obliku. Ovaj prostrani teren s osamnaest rupa nudi igračima ritmičnu igru kroz otvorene fairwaye, blage nagibe i široke vizure koje odišu spokojem. Svaka rupa pažljivo je uklopljena u krajolik, s naglaskom na prirodni tok igre i ugodnu dinamiku. Ime \"Zlatna Polja\" savršeno dočarava ugođaj – ovo je mjesto gdje sunce, zemlja i igra stvaraju neponovljiv sklad, a svaki udarac postaje dio šireg pejzaža.",
        "inventory": 1
    },
    {
        "id": 8,
        "name": "Mirna Dolina 9",
        "price": 27.00,
        "category": "golf teren",
        "description": "Uvučen među tihe obronke i nježno valovite ravnice, Mirna Dolina 9 predstavlja pravu oazu mira za golfere koji traže opuštenu, ali elegantnu igru. Ovaj teren s devet rupa kreiran je s naglaskom na jednostavnost, protočnost i uživanje u svakom udarcu. Bez dramatičnih visinskih razlika, ali s dovoljno karaktera, fairwayi se prirodno stapaju s okolišem stvarajući savršen balans između igre i odmora. Zvuk vjetra kroz travu, tišina prirode i ritam igre čine Mirnu Dolinu idealnim izborom za lagano jutarnje ili popodnevno igranje. Ime savršeno odražava ugođaj – ovo je mjesto gdje golf i spokoj idu ruku pod ruku.",
        "inventory": 1
    },

    # --- Dodatne usluge ---
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

    # --- Wellness ---
    {
        "id": 12,
        "name": "Masaža cijelog tijela",
        "price": 40.00,
        "category": "wellness",
        "description": "Opuštajuća masaža cijelog tijela u trajanju od 60 minuta pruža duboki osjećaj relaksacije i obnove. Stručne ruke terapeuta otklanjaju napetost i stres, potičući cirkulaciju i vraćajući energiju tijelu i umu. Uz umirujuću atmosferu i nježne mirise, ovaj tretman idealan je za sve koji žele pobjeći od svakodnevnog stresa i napuniti baterije u samo sat vremena.",
        "inventory": 1
    },
    {
        "id": 13,
        "name": "Sauna – Privatni termin",
        "price": 20.00,
        "category": "wellness",
        "description": "Sauna pruža duboku detoksikaciju i opuštanje tijela. Toplina saune pomaže u oslobađanju od toksina, poboljšava cirkulaciju i smanjuje napetost mišića, dok istovremeno umiruje um. Idealno za one koji žele revitalizirati tijelo i osvježiti duh u mirnom, toplom okruženju.",
        "inventory": 1
    },
    {
        "id": 14,
        "name": "Aromaterapija",
        "price": 40.00,
        "category": "wellness",
        "description": "Aromaterapija koristi moć eteričnih ulja za duboku relaksaciju i balansiranje tijela i uma. Nježne masažne tehnike u kombinaciji s aromatičnim mirisima pomažu u smanjenju stresa, podizanju raspoloženja i obnovi energije. Savršeno za one koji žele doživjeti holistički pristup opuštanju i njezi.",
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
