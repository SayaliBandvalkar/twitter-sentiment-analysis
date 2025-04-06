
import React from "react";
import "../styles/About.css";

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="flashcard hero">
        {/* <h1>About <span className="highlight">TweetHub</span></h1> */}
        <h2 style={{ fontWeight: "bold" }}> About TweetHub?</h2>
        <p>
          TweetHub is a real-time sentiment analysis platform designed to fetch and analyze live tweets using the Twitter API.
          It leverages advanced NLP models like <b>LSTM, Logistic Regression, and Naive Bayes</b> to classify tweets as positive, neutral, or negative.
          <br />
          The backend, built with <b>Flask</b>, efficiently processes real-time data, while the frontend, developed using <b>React</b>, provides an intuitive dashboard for sentiment visualization.
          <br />
          Analyzed tweets are stored in an <b>SQLite</b> database, making TweetHub a powerful tool to track public sentiment and online discussions. Even users can contribute to the platform by submitting their own tweets or can upload their own datasets using upload CSV.
        </p>
      </div>

      {/* Features Section */}
      <div className="flashcard features">
        {/* <h2>🔍 Why Choose TweetHub?</h2> */}
        <h2 style={{ fontWeight: "bold" }}>🔍 Why Choose TweetHub?</h2>
        <div className="feature-list">
          <div className="feature">
            <h3>⚡ Real-Time Sentiment Analysis</h3>
            <p>Instantly fetch and analyze tweets as they happen.</p>
          </div>
          <div className="feature">
            <h3>📊 Interactive Dashboard</h3>
            <p>Visualize sentiment trends with dynamic charts.</p>
          </div>
          <div className="feature">
            <h3>🤖 AI-Powered Insights</h3>
            <p>Leverages machine learning models for accurate classification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
