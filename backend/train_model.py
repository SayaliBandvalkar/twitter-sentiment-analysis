# import pandas as pd
# import matplotlib.pyplot as plt
# import seaborn as sns
# import joblib
# import numpy as np
# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
# from tensorflow.keras.preprocessing.text import Tokenizer
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.metrics import accuracy_score, precision_score, f1_score, classification_report

# ### Step 1: Load Preprocessed Dataset ###
# try:
#     df = pd.read_csv("tweets_cleaned.csv")
#     df.columns = df.columns.str.strip()  # Remove any unwanted spaces
#     print("Dataset Columns:", df.columns.tolist())  # Debugging
# except Exception as e:
#     print("❌ Error reading dataset:", str(e))
#     exit()

# # Ensure required columns exist
# if "cleaned_text" not in df.columns:
#     print("❌ Error: Required column 'cleaned_text' not found in dataset.")
#     exit()

# # Add a 'label' column (Modify this as per your actual sentiment labeling logic)
# df["label"] = df["cleaned_text"].apply(lambda x: 1 if "good" in x else (0 if "bad" in x else 2))

# # Split dataset into training and testing
# X = df["cleaned_text"]
# y = df["label"]
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# ### Logistic Regression Model ###
# tfidf = TfidfVectorizer(max_features=5000)
# X_train_tfidf = tfidf.fit_transform(X_train)
# X_test_tfidf = tfidf.transform(X_test)

# logistic_model = LogisticRegression(max_iter=1000)
# logistic_model.fit(X_train_tfidf, y_train)
# y_pred_logistic = logistic_model.predict(X_test_tfidf)

# accuracy_logistic = accuracy_score(y_test, y_pred_logistic)
# precision_logistic = precision_score(y_test, y_pred_logistic, average='weighted', zero_division=1)
# f1_logistic = f1_score(y_test, y_pred_logistic, average='weighted')

# # Save Logistic Regression Model
# joblib.dump(logistic_model, "logistic_model.pkl")
# joblib.dump(tfidf, "tfidf_vectorizer.pkl")

# ### Naïve Bayes Model ###
# nb_model = MultinomialNB()
# nb_model.fit(X_train_tfidf, y_train)
# y_pred_nb = nb_model.predict(X_test_tfidf)

# accuracy_nb = accuracy_score(y_test, y_pred_nb)
# precision_nb = precision_score(y_test, y_pred_nb, average='weighted', zero_division=1)
# f1_nb = f1_score(y_test, y_pred_nb, average='weighted')

# # Save Naïve Bayes Model
# joblib.dump(nb_model, "naive_bayes_model.pkl")

# ### LSTM Model ###
# # Tokenization & Padding
# tokenizer = Tokenizer(num_words=10000, oov_token="<OOV>")
# tokenizer.fit_on_texts(X_train)
# X_train_seq = tokenizer.texts_to_sequences(X_train)
# X_test_seq = tokenizer.texts_to_sequences(X_test)
# X_train_padded = pad_sequences(X_train_seq, maxlen=100, padding='post', truncating='post')
# X_test_padded = pad_sequences(X_test_seq, maxlen=100, padding='post', truncating='post')

# # Build LSTM Model
# lstm_model = Sequential([
#     Embedding(input_dim=10000, output_dim=64, input_length=100),
#     LSTM(64, return_sequences=True),
#     Dropout(0.3),
#     LSTM(32),
#     Dropout(0.3),
#     Dense(3, activation="softmax")
# ])

# lstm_model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
# lstm_model.fit(X_train_padded, y_train, epochs=5, batch_size=32, validation_data=(X_test_padded, y_test))

# # Evaluate LSTM Model
# y_pred_lstm_prob = lstm_model.predict(X_test_padded)
# y_pred_lstm = np.argmax(y_pred_lstm_prob, axis=1)

# accuracy_lstm = accuracy_score(y_test, y_pred_lstm)
# precision_lstm = precision_score(y_test, y_pred_lstm, average='weighted', zero_division=1)
# f1_lstm = f1_score(y_test, y_pred_lstm, average='weighted')

# # Save LSTM Model
# lstm_model.save("lstm_model.h5")
# joblib.dump(tokenizer, "tokenizer.pkl")

# ### Compare Model Performances ###
# models = ["Logistic Regression", "Naïve Bayes", "LSTM"]
# accuracies = [accuracy_logistic * 100, accuracy_nb * 100, accuracy_lstm * 100]
# precisions = [precision_logistic * 100, precision_nb * 100, precision_lstm * 100]
# f1_scores = [f1_logistic * 100, f1_nb * 100, f1_lstm * 100]

# # Plot Accuracy, Precision, F1-Score
# plt.figure(figsize=(12, 5))

# plt.subplot(1, 3, 1)
# sns.barplot(x=models, y=accuracies, palette="Blues")
# plt.ylim(0, 100)
# plt.ylabel("Score (%)")
# plt.title("Accuracy")

# plt.subplot(1, 3, 2)
# sns.barplot(x=models, y=precisions, palette="Greens")
# plt.ylim(0, 100)
# plt.ylabel("Score (%)")
# plt.title("Precision")

# plt.subplot(1, 3, 3)
# sns.barplot(x=models, y=f1_scores, palette="Reds")
# plt.ylim(0, 100)
# plt.ylabel("Score (%)")
# plt.title("F1 Score")

# plt.tight_layout()
# plt.show()




















import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import numpy as np 
import pickle  # Add this at the beginning
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, precision_score, f1_score, classification_report

# Load preprocessed dataset
df = pd.read_csv("tweets_cleaned.csv")

# Overwrite "tweets_cleaned_fixed.csv" with the updated data
df.to_csv("tweets_cleaned_fixed.csv"
          )
print("Updated tweets_cleaned_fixed.csv with new data from tweets_cleaned.csv")

# Check if required columns exist
if "cleaned_text" not in df.columns:
    print("Error: Column 'cleaned_text' not found in dataset.")
    exit()

# Labeling function with better classification logic
def assign_label(text):
    text = text.lower()  # Ensure case-insensitivity
    if any(word in text for word in ["good", "great", "awesome", "happy", "love", "excellent"]):
        return 1  # Positive
    elif any(word in text for word in ["bad", "terrible", "sad", "angry", "hate", "awful"]):
        return 0  # Negative
    return 2  # Neutral

# Apply labels
df["label"] = df["cleaned_text"].apply(assign_label)

# Verify label distribution
print("Label Distribution:\n", df["label"].value_counts())

# Check if we have at least two unique labels
if df["label"].nunique() < 2:
    print("Error: Dataset contains only one class. Ensure correct label assignment.")
    exit()

# Split dataset
X = df["cleaned_text"]
y = df["label"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

### Logistic Regression Model ###
tfidf = TfidfVectorizer(max_features=5000)
tfidf = joblib.load("tfidf_vectorizer.pkl")
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

logistic_model = LogisticRegression(max_iter=1000)
logistic_model.fit(X_train_tfidf, y_train)
y_pred_logistic = logistic_model.predict(X_test_tfidf)

accuracy_logistic = accuracy_score(y_test, y_pred_logistic)
precision_logistic = precision_score(y_test, y_pred_logistic, average='weighted', zero_division=1)
f1_logistic = f1_score(y_test, y_pred_logistic, average='weighted')

# Save Logistic Regression Model
joblib.dump(logistic_model, "logistic_model.pkl")
joblib.dump(tfidf, "tfidf_vectorizer.pkl")

# Load Logistic Regression Model
logistic_model = joblib.load("logistic_model.pkl")

### Naïve Bayes Model ###
nb_model = MultinomialNB()
nb_model.fit(X_train_tfidf, y_train)
y_pred_nb = nb_model.predict(X_test_tfidf)

accuracy_nb = accuracy_score(y_test, y_pred_nb)
precision_nb = precision_score(y_test, y_pred_nb, average='weighted', zero_division=1)
f1_nb = f1_score(y_test, y_pred_nb, average='weighted')

# Save Naïve Bayes Model
joblib.dump(nb_model, "naive_bayes_model.pkl")

# Load Naïve Bayes Model
nb_model = joblib.load("naive_bayes_model.pkl")

### LSTM Model ###
# Tokenization & Padding
tokenizer = Tokenizer(num_words=10000, oov_token="<OOV>")
tokenizer.fit_on_texts(X_train)
X_train_seq = tokenizer.texts_to_sequences(X_train)
X_test_seq = tokenizer.texts_to_sequences(X_test)
X_train_padded = pad_sequences(X_train_seq, maxlen=100, padding='post', truncating='post')
X_test_padded = pad_sequences(X_test_seq, maxlen=100, padding='post', truncating='post')

# Build LSTM Model
lstm_model = Sequential([
    Embedding(input_dim=10000, output_dim=64, input_length=100),
    LSTM(64, return_sequences=True),
    Dropout(0.3),
    LSTM(32),
    Dropout(0.3),
    Dense(3, activation="softmax")
])

lstm_model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
lstm_model.fit(X_train_padded, y_train, epochs=5, batch_size=32, validation_data=(X_test_padded, y_test))

# Evaluate LSTM Model
y_pred_lstm_prob = lstm_model.predict(X_test_padded)
y_pred_lstm = np.argmax(y_pred_lstm_prob, axis=1)

accuracy_lstm = accuracy_score(y_test, y_pred_lstm)
precision_lstm = precision_score(y_test, y_pred_lstm, average='weighted', zero_division=1)
f1_lstm = f1_score(y_test, y_pred_lstm, average='weighted')

# Save LSTM Model
lstm_model.save("lstm_model.h5")
joblib.dump(tokenizer, "tokenizer.pkl")
lstm_model = load_model("lstm_model.h5")


### Compare Model Performances ###
models = ["Logistic Regression", "Naïve Bayes", "LSTM"]
accuracies = [accuracy_logistic * 100, accuracy_nb * 100, accuracy_lstm * 100]
precisions = [precision_logistic * 100, precision_nb * 100, precision_lstm * 100]
f1_scores = [f1_logistic * 100, f1_nb * 100, f1_lstm * 100]

# Plot Accuracy, Precision, F1-Score
plt.figure(figsize=(12, 5))

plt.subplot(1, 3, 1)
sns.barplot(x=models, y=accuracies, palette="Blues")
plt.ylim(0, 100)
plt.ylabel("Score (%)")
plt.title("Accuracy")

plt.subplot(1, 3, 2)
sns.barplot(x=models, y=precisions, palette="Greens")
plt.ylim(0, 100)
plt.ylabel("Score (%)")
plt.title("Precision")

plt.subplot(1, 3, 3)
sns.barplot(x=models, y=f1_scores, palette="Reds")
plt.ylim(0, 100)
plt.ylabel("Score (%)")
plt.title("F1 Score")

plt.tight_layout()
plt.show()













