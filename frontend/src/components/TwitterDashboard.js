import { useNavigate } from "react-router-dom"; // Import for navigation
import React, { useEffect, useState } from "react";                                   
import axios from "axios";
import { Bar  } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/TwitterDashboard.css";
import "../styles/Navbar.css";
import "../styles/UploadCSV.css";

const TwitterDashboard = () => {
    const [stats, setStats] = useState({ tweets: 0, retweets: 0, tweet_id: 0 });
    const [recentTweets, setRecentTweets] = useState([]);
    const [sentimentDistribution, setSentimentDistribution] = useState({});
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const navigate = useNavigate(); // Hook for navigation


    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError("");

        try {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) {
                setError("Unauthorized access. Please login.");
                return;
            }

            const response = await axios.get("http://127.0.0.1:5000/dashboard_data", {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            console.log("Dashboard Data:", response.data);
            setStats((prevStats) => ({ ...prevStats, ...response.data.stats }));
            setRecentTweets(response.data.recent_tweets || []);
            setSentimentDistribution(response.data.sentiment_distribution || {});
        } catch (err) {
            setError(err.message || "Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!inputText.trim()) return;
        setIsSubmitting(true);
        setError("");

        try {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) throw new Error("Unauthorized access. Please login.");

            const response = await axios.post(
                "http://127.0.0.1:5000/add_tweet",
                { text: inputText },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            alert(`Sentiment: ${response.data.sentiment}`);
            setInputText("");
            fetchDashboardData();
        } catch (err) {
            setError("Error submitting tweet. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCsvUpload = async () => {
        if (!csvFile) {
            alert("Please select a CSV file first!");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", csvFile);
    
        try {
            const response = await axios.post("http://127.0.0.1:5000/upload_csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("Server Response:", response.data);
            alert(`CSV uploaded successfully! Server message: ${response.data.message}`);
            navigate("/csv-dashboard"); // Redirect to CsvDashboard.js
        } catch (error) {
            console.error("Upload error:", error.response ? error.response.data : error);
            alert("Upload failed. Try again.");
        }
    };
    
    

    const sentimentLabels = Object.keys(sentimentDistribution);
    const sentimentData = sentimentLabels.length ? Object.values(sentimentDistribution) : [10, 5, 15, 20];
    const chartColors = ["#795548", "#4caf50", "#ffeb3b", "#e91e63", "#9c27b0", "#f44336", "#00bcd4"];


    return (
        <div className="dashboard-container">
            <nav className="navbar d-flex justify-content-center align-items-center rounded">
                <h2 style={{ color: "white" }}>Sentiment Analysis Dashboard</h2>
            </nav>

            {error && <p className="error-message">{error}</p>}

            <h3>Overall Stats</h3>
            <div className="stats-container">
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <span role="img" aria-label="New Tweets">📈</span>
                            <p>New Tweets</p>
                            <h4>{stats.tweets}</h4>
                        </div>
                        <div className="flip-card-back">
                            <p>Latest tweets fetched from API.</p>
                        </div>
                    </div>
                </div>

                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <span role="img" aria-label="Retweets">🔁</span>
                            <p>Retweets</p>
                            <h4>{stats.retweets}</h4>
                        </div>
                        <div className="flip-card-back">
                            <p>Total number of retweets counted.</p>
                        </div>
                    </div>
                </div>

                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <span role="img" aria-label="Tweet ID">🆔</span>
                            <p>Tweet ID</p>
                            <h4>{stats.tweet_id}</h4>
                        </div>
                        <div className="flip-card-back">
                            <p>ID of the most recent tweet.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Tweet & Upload CSV - Side by Side */}
            <div className="tweet-upload-container">
    {/* Submit a Tweet Section */}
    <div className="tweet-box">
        <h3>Submit a Tweet</h3>
        <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your tweet..."
        />
        <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
        </button>
    </div>

    {/* Upload CSV Section */}
    <div className="upload-box">
        <h3>Upload CSV</h3>
        <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
        <button className="upload-btn" onClick={handleCsvUpload} style={{marginLeft:0}}>Upload CSV File</button>
    </div>
</div>

            <h3>Sentiment Trends</h3>
            {loading ? <p>Loading...</p> : (
                <Bar data={{ labels: sentimentLabels, datasets: [{ label: "Sentiment Count", data: sentimentData, backgroundColor: chartColors }] }} />
            )}

            

            <h3>Recent Tweets</h3>
            <div className="tweets-table-container">
                <table className="tweets-table">
                    <thead className="table-dark">
                        <tr>
                            {<th>ID</th> }
                            <th>Tweet</th>
                            <th>Sentiment</th>
                            
                            
                        </tr>
                    </thead>
                    <tbody>
                        {recentTweets.map((tweet, index) => (
                            <tr key={index}>
                                {<td>{tweet.tweet_id}</td> }
                                <td>{tweet.tweet}</td>
                                <td>{tweet.sentiment}</td>
                                
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TwitterDashboard;
