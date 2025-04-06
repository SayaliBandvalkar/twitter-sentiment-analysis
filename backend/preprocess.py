import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from langdetect import detect

# Download stopwords (if not downloaded)
nltk.download("stopwords")
nltk.download("punkt")

# Load English stopwords
stop_words = set(stopwords.words("english"))

def is_english(text):
    """Detects if a given text is in English."""
    try:
        return detect(text) == "en"
    except:
        return False  # If detection fails, treat as non-English

def clean_text(text):
    """Cleans tweet text by removing links, mentions, special characters, and stopwords."""
    text = text.lower()  # Convert to lowercase
    text = re.sub(r"http\S+|www\S+", "", text)  # Remove URLs
    text = re.sub(r"@\w+", "", text)  # Remove mentions (@user)
    text = re.sub(r"#\w+", "", text)  # Remove hashtags
    text = re.sub(r"[^\w\s]", "", text)  # Remove punctuation
    text = re.sub(r"\d+", "", text)  # Remove numbers
    tokens = word_tokenize(text)  # Tokenize words
    tokens = [word for word in tokens if word not in stop_words]  # Remove stopwords
    return " ".join(tokens)

def preprocess_tweets(input_file="tweets.json", output_file="tweets_cleaned.csv"):
    """Reads tweet data from JSON, cleans it, filters non-English tweets, and saves as CSV."""
    df = pd.read_json(input_file)
    
    # Filter only English tweets
    df = df[df["text"].apply(is_english)]
    
    # Apply text cleaning
    df["cleaned_text"] = df["text"].apply(clean_text)
    
    # Save preprocessed tweets
    df.to_csv(output_file, index=False)
    print(f"Preprocessed English tweets saved to {output_file}")

def vectorize_text(input_file="tweets_cleaned.csv", vectorizer_file="tfidf_vectorizer.pkl"):
    """Converts cleaned text into TF-IDF vectors and saves the vectorizer."""
    df = pd.read_csv(input_file)
    vectorizer = TfidfVectorizer(max_features=5000)  # Convert text to TF-IDF features
    X = vectorizer.fit_transform(df["cleaned_text"])
    
    # Save vectorizer for future use
    with open(vectorizer_file, "wb") as file:
        pickle.dump(vectorizer, file)
    
    print(f"Vectorizer saved as {vectorizer_file}")
    return X

# Run preprocessing
if __name__ == "__main__":
    preprocess_tweets()
    vectorize_text()
