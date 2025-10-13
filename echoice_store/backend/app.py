from dotenv import load_dotenv
import os

# Stripe (payment)
import stripe

# Flask core
from flask import Flask, request, jsonify
from flask_cors import CORS

# PostgreSQL connection
import psycopg2
from psycopg2.extras import RealDictCursor

# Password hashing
from flask_bcrypt import Bcrypt

# Configuration
from config import Config

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

load_dotenv()  # loads .env
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def get_db_connection():
    return psycopg2.connect(Config.get_db_uri(), cursor_factory=RealDictCursor)

@app.route('/testdb')
def test_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        cur.close()
        conn.close()
        return f"Connected to PostgreSQL! Version: {version}"
    except Exception as e:
        return str(e)

# ----------------------------
# SIGNUP
# ----------------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    if not email or not username or not password:
        return jsonify({"error": "Missing fields"}), 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (email, username, password_hash) VALUES (%s, %s, %s) RETURNING id;",
            (email, username, pw_hash)
        )
        user_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "User created", "user_id": user_id}), 201
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Email or username already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# LOGIN
# ----------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, password_hash FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if user and bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({
            "message": "Login successful",
            "user_id": user['id'],
            "username": user['username'],
            "email": user['email']
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# ----------------------------
# LOGOUT
# ----------------------------
@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out"}), 200

# ----------------------------
# PRODUCTS
# ----------------------------
@app.route('/products', methods=['GET'])
def get_products():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, title, description, price_cents, file_path FROM products")
        products = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# CREATE CHECKOUT SESSION (Test Mode)
# ----------------------------
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    product_id = data.get('product_id')
    user_id = data.get('user_id')

    if not product_id:
        return jsonify({"error": "Missing product_id"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch product
        cur.execute("SELECT id, title, price_cents FROM products WHERE id=%s", (product_id,))
        product = cur.fetchone()
        if not product:
            cur.close()
            conn.close()
            return jsonify({"error": f"Product with id {product_id} not found"}), 404

        # Insert a test purchase in DB
        cur.execute(
            "INSERT INTO purchases (user_id, product_id, price_cents, status) VALUES (%s, %s, %s, %s) RETURNING id",
            (user_id if user_id else None, product['id'], product['price_cents'], 'test')
        )
        purchase_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()

        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': product['title']},
                    'unit_amount': product['price_cents'],
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"http://127.0.0.1:5000/success?session_id={{CHECKOUT_SESSION_ID}}&purchase_id={purchase_id}",
            cancel_url='http://127.0.0.1:5000/cancel',
            metadata={'user_id': user_id or "guest", 'purchase_id': purchase_id}
        )

        return jsonify({"url": session.url}), 200

    except stripe.error.StripeError as e:
        return jsonify({"error": f"Stripe error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ----------------------------
# SUCCESS/CANCEL
# ----------------------------
@app.route('/success')
def success():
    purchase_id = request.args.get('purchase_id')
    return f"Payment successful! (Test Mode) Purchase ID: {purchase_id}"

@app.route('/cancel')
def cancel():
    return "Payment canceled."

if __name__ == '__main__':
    app.run(debug=True)
