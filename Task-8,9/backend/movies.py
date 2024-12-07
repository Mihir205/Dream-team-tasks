from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from flask import session

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'thisisasecretkey'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

movies = {
    1: {
        "id": 1,
        "title": "Lucky Bhasker",
        "genre": "Action",
        "year": "2024",
        "description": "A cash-strapped cashier working at a bank embarks on a risky investment scheme and soon gets drawn into the murky world of money laundering.",
        "image": "/pics/luckybhasker.jpg"
    },
    2: {
        "id": 2,
        "title": "Venom: The Last Dance",
        "genre": "Sci-Fi",
        "year": "2024",
        "description": "Eddie Brock and Venom must make a devastating decision as they're pursued by a mysterious military man and alien monsters from Venom's home world.",
        "image": "/pics/venom.jpg"
    },
    3: {
        "id": 3,
        "title": "Devara",
        "genre": "Action",
        "year": "2024",
        "description": "A mighty sea warrior takes a violent stand against the criminal deeds of his village. Years later, his mild-mannered son walks a path of his own.",
        "image": "/pics/devara.jpg"
    },
    4: {
        "id": 4,
        "title": "Moana 2",
        "genre": "Action",
        "year": "2024",
        "description": "After receiving an unexpected call from her wayfinding ancestors, Moana must journey to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
        "image": "/pics/moana.jpg"
    },
    5: {
        "id": 5,
        "title": "Saripodha Sanivaram",
        "genre": "Action",
        "year": "2024",
        "description": "In order to defend the innocent from a corrupt and brutal cop, a vigilante hero must work around his own self-imposed code of honor.",
        "image": "/pics/ss.jpg"
    },
    6: {
        "id": 6,
        "title": "Amaran",
        "genre": "Sci-Fi",
        "year": "2024",
        "description": "The life of Major Mukund Varadarajan and is set against the backdrop of the Qazipathri Operation in Shopian, Kashmir, which took place back in 2014.",
        "image": "/pics/amaran.jpg"
    },
    7: {
        "id": 7,
        "title": "Sathyam Sundharam",
        "genre": "Drama",
        "year": "2024",
        "description": "A man's life is changed when he bumps into someone from his hometown in this moving Tamil-language drama; gentle scenes are occasionally punctuated by sporting threat and recollections of violence.",
        "image": "/pics/sathyam.jpg"
    },
    8: {
        "id": 8,
        "title": "Kanguva",
        "genre": "Action",
        "year": "2024",
        "description": "A tribal warrior's fierce struggle to save his people a millennium ago is mysteriously linked to a shadow cop's perilous quest in the present.",
        "image": "/pics/kanguva.jpg"
    },
}

reviews = {
    1: ["Amazing movie!", "Loved the concept."],
    2: ["Best Batman movie!", "Heath Ledger was phenomenal."],
}

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    tasklist = db.relationship('Task', backref='user', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

tasklist = [] 

@app.route('/movie/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    movie = movies.get(movie_id)
    if movie:
        movie_reviews = reviews.get(movie_id, [])  
        return jsonify({"movie": movie, "reviews": movie_reviews})
    return jsonify({"error": "Movie not found"}), 404

@app.route('/movie/<int:movie_id>/review', methods=['POST'])
def add_movie_review(movie_id):
    movie = movies.get(movie_id)
    if not movie:
        return jsonify({"error": "Movie not found"}), 404

    data = request.json
    review_text = data.get("review")
    username = data.get("username", "Guest")  

    if not review_text:
        return jsonify({"error": "Review cannot be empty"}), 400

    if movie_id not in reviews:
        reviews[movie_id] = []
    new_review = {"text": review_text, "username": username}
    reviews[movie_id].append(new_review)

    return jsonify({"message": "Review added successfully", "review": new_review})


@app.route('/tasklist', methods=['POST'])
def add_to_tasklist():
    data = request.get_json()
    if data and "id" in data:
        movie_id = data["id"]
        movie = movies.get(movie_id)
        if movie and movie not in tasklist:
            tasklist.append(movie)
            return jsonify({"message": "Movie added to tasklist successfully."})
        elif movie in tasklist:
            return jsonify({"message": "Movie already in tasklist."}), 400
        return jsonify({"error": "Movie not found."}), 404
    return jsonify({"error": "Invalid data provided."}), 400

@app.route('/tasklist', methods=['GET'])
def get_tasklist():
    return jsonify(tasklist)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')

    if not all([name, email, phone_number, password]):
        return jsonify({"error": "All fields are required."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered."}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, phone_number=phone_number, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully."}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Login successful.", "user": {"name": user.name, "email": user.email}}), 200

    return jsonify({"error": "Invalid credentials."}), 401
    

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful."}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
