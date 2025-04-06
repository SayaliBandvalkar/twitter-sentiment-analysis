import os                                                                      # recent important 
import sqlite3
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from textblob import TextBlob
from werkzeug.utils import secure_filename
from preprocess import clean_text  # Ensure preprocess.py exists



app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Database Paths
USER_DB_PATH = "users.db"
SENTIMENTS_DB_PATH = "sentiments.db"
CSV_PATH = "tweets_cleaned_fixed.csv"

# Initialize Users Database
def init_users_db():
    with sqlite3.connect(USER_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT
            )
        ''')
        conn.commit()

# Initialize Sentiments Database
def initialize_sentiments_db():
    with sqlite3.connect(SENTIMENTS_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sentiments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tweet_id TEXT UNIQUE,
                created_at TEXT,
                text TEXT,
                author_id INTEGER,
                cleaned_text TEXT,
                polarity REAL,
                sentiment TEXT
            )
        ''')
        conn.commit()

# Sentiment Analysis
def analyze_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity

    if polarity > 0.6:
        sentiment = "Strongly Positive"
    elif polarity > 0.3:
        sentiment = "Positive"
    elif polarity >= 0.1:
        sentiment = "Weakly Positive"
    elif polarity == 0:
        sentiment = "Neutral"
    elif polarity >= -0.3:
        sentiment = "Weakly Negative"
    elif polarity >= -0.6:
        sentiment = "Negative"
    else:
        sentiment = "Strongly Negative"

    return polarity, sentiment

# Initialize both databases
init_users_db()
initialize_sentiments_db()

# User Registration
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        conn = sqlite3.connect(USER_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, password))
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
 # User Login
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Both email and password are required"}), 400

        conn = sqlite3.connect(USER_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            return jsonify({"message": "Login successful!","redirect": "/dashboard"}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500   

# API Home
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to the Sentiment Analysis API!",
        "endpoints": {
            "/get_sentiments": "Retrieve all stored sentiments.",
            "/dashboard_data": "Get structured sentiment data for the dashboard.",
            "/add_tweet": "Add a tweet and predict its sentiment.",
            "/csv-data" : "CSV uploaded and stored successfully"
        }
    })

# Add a tweet and predict its sentiment
from preprocess import clean_text  # Import the clean_text function

@app.route('/add_tweet', methods=['POST'])
def add_tweet():
    try:
        data = request.get_json()
        if 'text' not in data:
            return jsonify({"error": "'text' field is required!"}), 400

        tweet_text = data['text']
        cleaned_text = clean_text(tweet_text)  # Preprocess the text
        polarity, sentiment = analyze_sentiment(cleaned_text)  # Analyze the cleaned text

        with sqlite3.connect(SENTIMENTS_DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO sentiments (text, cleaned_text, polarity, sentiment) VALUES (?, ?, ?, ?)", 
                           (tweet_text, cleaned_text, polarity, sentiment))
            conn.commit()

        return jsonify({
            "tweet": tweet_text,
            "cleaned_text": cleaned_text,
            "polarity": polarity,
            "sentiment": sentiment
        })
    except Exception as e:
        return jsonify({"error": str(e)})


# Retrieve stored sentiments
@app.route('/get_sentiments', methods=['GET'])
def get_sentiments():
    try:
        with sqlite3.connect(SENTIMENTS_DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT tweet_id, created_at, text, author_id, cleaned_text, polarity, sentiment FROM sentiments")
            data = [
                {"tweet_id": row[0], "created_at": row[1], "text": row[2],
                 "author_id": row[3], "cleaned_text": row[4], "polarity": row[5], "sentiment": row[6]}
                for row in cursor.fetchall()
            ]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
    
# Upload CSV and Store in Database
@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)
    
    return jsonify({"message": "CSV uploaded and stored successfully"}), 200
    
# API to Fetch CSV Data from Database
@app.route('/csv-data', methods=['GET'])
def get_csv_data():
    try:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], "extra_sentiment.csv")
        
        # Ensure the file exists
        if not os.path.exists(file_path):
            return jsonify({"error": "CSV file not found"}), 404

        # Read CSV file
        df = pd.read_csv(file_path)
        
        # Convert DataFrame to list of dictionaries (JSON-like response)
        data = df.to_dict(orient="records")
        
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

# Dashboard Data for Sentiment Analysis
@app.route('/dashboard_data', methods=['GET'])
def dashboard_data():
    try:
        with sqlite3.connect(SENTIMENTS_DB_PATH) as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM sentiments")
            total_tweets = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM sentiments WHERE sentiment LIKE '%Positive%'")
            retweets = cursor.fetchone()[0]

            
            # Fetch recent tweets with sentiment and tweet_id
            cursor.execute("SELECT tweet_id, cleaned_text, sentiment FROM sentiments ORDER BY id DESC LIMIT 20")
            recent_tweets = [{"tweet_id": row[0], "tweet": row[1], "sentiment": row[2]} for row in cursor.fetchall()]
            
            # Count of each sentiment type 
            cursor.execute("SELECT sentiment, COUNT(*) FROM sentiments GROUP BY sentiment")
            sentiment_counts = {row[0]: row[1] for row in cursor.fetchall()}
            
            return jsonify({
                "stats": { "tweets": total_tweets, "retweets": retweets, "tweet_id": total_tweets },
                "recent_tweets": recent_tweets,
                "sentiment_distribution": sentiment_counts
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)

