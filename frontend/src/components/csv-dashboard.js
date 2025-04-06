import React, { useState, useEffect } from "react";
import {Bar, Line} from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Table } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "../styles/csv-dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const locations = [
  { name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Dallas", lat: 32.7767, lon: -96.7970 },
  { name: "Las Vegas", lat: 36.1699, lon: -115.1398 },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Denver", lat: 39.7392, lon: -104.9903 },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { name: "Boston", lat: 42.3601, lon: -71.0589 },
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
  { name: "Seattle", lat: 47.6062, lon: -122.3321 },
  { name: "Austin", lat: 30.2672, lon: -97.7431 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Atlanta", lat: 33.7490, lon: -84.3880 },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { name: "Phoenix", lat: 33.4484, lon: -112.0740 },
  { name: "San Diego", lat: 32.7157, lon: -117.1611 },
  { name: "Miami", lat: 25.7617, lon: -80.1918 },
  { name: "Houston", lat: 29.7604, lon: -95.3698 }
];

const CsvDashboard = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
  const [userRetweetChartData, setUserRetweetChartData] = useState({ labels: [], datasets: [] });
  const [splineChartData, setSplineChartData] = useState({ labels: [], datasets: [] });
 

  useEffect(() => {
    fetch("http://localhost:5000/csv-data") // Fetch from Flask API
      .then((response) => response.json())
      .then((csvData) => {
        console.log("Fetched CSV Data:", csvData);
        setData(csvData);
        generateCharts(csvData);
        generateLineCharts(csvData);
        generateUserRetweetChart(csvData);
        generateSplineChart(csvData);
        

      })
      .catch((error) => console.error("Fetch CSV Error:", error));
  }, []);

  const generateCharts = (parsedData) => {
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };

    parsedData.forEach((row) => {
      if (row.sentiment === "Positive") sentimentCounts.Positive++;
      if (row.sentiment === "Neutral") sentimentCounts.Neutral++;
      if (row.sentiment === "Negative") sentimentCounts.Negative++;
    });

    setChartData({
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          label: "Sentiment Distribution",
          data: [sentimentCounts.Positive, sentimentCounts.Neutral, sentimentCounts.Negative],
          backgroundColor: ["#28a745", "#007bff", "#dc3545"],
          hoverBackgroundColor: ["#218838", "#0056b3", "#c82333"],
        },
      ],
    });
  };

  const generateLineCharts = (parsedData) => {
    // Sorting data by Created At timestamps
    const sortedData = parsedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Data for Created At vs Likes
    const timestamps = sortedData.map((row) => new Date(row.created_at).toLocaleDateString());
    const likes = sortedData.map((row) => row.likes);

    // Setting state for Line Chart - Created At vs Likes
    setLineChartData({
      labels: timestamps,
      datasets: [
        {
          label: "Likes Over Time",
          data: likes,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          pointBackgroundColor: "#007bff",
          pointBorderColor: "#fff",
          fill: true,
        },
      ],
    });
  };

  const generateUserRetweetChart = (parsedData) => {
    const userRetweetMap = {};

    parsedData.forEach((row) => {
      if (userRetweetMap[row.User]) {
        userRetweetMap[row.User] += row.retweets;
      } else {
        userRetweetMap[row.User] = row.retweets;
      }
    });

    // Sort users by retweet count (descending)
    const sortedUsers = Object.entries(userRetweetMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Show only the top 10 users

    const users = sortedUsers.map(([user]) => user);
    const retweets = sortedUsers.map(([_, retweets]) => retweets);

    setUserRetweetChartData({
      labels: users,
      datasets: [
        {
          type: "bar",
          label: "Total Retweets",
          data: retweets,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          type: "line",
          label: "Retweet Trend",
          data: retweets,
          borderColor: "#FF5733",
          backgroundColor: "rgba(255, 87, 51, 0.4)",
          pointBackgroundColor: "#FF5733",
          pointBorderColor: "#fff",
          fill: true,
        },
      ],
    });
  };

  const generateSplineChart = (parsedData) => {
    const userPolarityMap = {};
    parsedData.forEach((row) => {
      if (!userPolarityMap[row.User]) {
        userPolarityMap[row.User] = [];
      }
      userPolarityMap[row.User].push(row.polarity);
    });
    const users = Object.keys(userPolarityMap).slice(0, 10);
    const polarities = users.map((user) => userPolarityMap[user].reduce((a, b) => a + b, 0) / userPolarityMap[user].length);

    setSplineChartData({
      labels: users,
      datasets: [
        {
          label: "User Polarity Trend",
          data: polarities,
          borderColor: "#FF5733",
          backgroundColor: "hsla(258, 73.10%, 40.80%, 0.20)",
          pointBackgroundColor: "#FF5733",
          pointBorderColor: "#fff",
          fill: true,
          tension: 0.4, 
        },
      ],
    });
  };


  return (
    <Container fluid className="mt-4 py-4  bg-white">
      <h2 className="text-center text-white bg-black px-3 py-2 rounded">Sentiment Analysis Dashboard</h2>


      {/* <row className="mb-4">
        <Col md={6}>{chartData.datasets.length > 0 ? <Bar data={chartData} /> : <p>Loading chart...</p>}</Col>
        <Col md={6}>{lineChartData.datasets.length > 0 ? <Line data={lineChartData} /> : <p>Loading line chart...</p>}</Col> 
      </row> */}

<Row className="mb-4">
    {/* Bar Chart */}
    <Col md={6}>
    <h2> Bar chart </h2>
      {chartData.datasets.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </Col>

    {/* Line Chart */}
    <Col md={6} >
    <h2> Line Chart </h2>
      {lineChartData.datasets.length > 0 ? (
        <Line data={lineChartData} />
      ) : (
        <p>Loading line chart...</p>
      )}
    </Col>
  </Row>

<Row className="mb-4">
  {/* User-Retweet Bar Chart */}
  <Col md={6}> 
  <h2> User Retweet Chart </h2>
    {userRetweetChartData.datasets.length > 0 ? (
      <Bar data={userRetweetChartData} />
    ) : (
      <p>Loading User-Retweet Chart...</p>
    )}
  </Col>

  {/* Spline Line Chart */}
  <Col md={6}>
  <h2> User & Polarity Spline chart </h2>
    {splineChartData.datasets.length > 0 ? (
      <Line data={splineChartData} />
    ) : (
      <p>Loading Spline Chart...</p>
    )}
  </Col>
</Row>


      <h3 className="mt-4">Tweet Locations</h3>
      <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MarkerClusterGroup>
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lon]} icon={customIcon}>
              <Popup>
                <strong>Location:</strong> {loc.name}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <h3 className="mt-4">Tweet Data Table</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
      <Table striped bordered hover responsive>
      <thead className="table-dark">
          <tr>
            <th>User ID</th>
            <th>Created At</th>
            <th>User</th>
            <th>Cleaned Text</th>
            <th>Sentiment</th>
            <th>Likes</th>
            <th>Retweets</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                <td>{row.user_id}</td>
                <td>{row.created_at}</td>
                <td>{row.User}</td>
                <td>{row.cleaned_text}</td>
                <td className={
                  row.sentiment === "Positive" ? "text-success" :
                  row.sentiment === "Neutral" ? "text-primary" : "text-danger"
                }>{row.sentiment}</td>
                <td>{row.likes}</td>
                <td>{row.retweets}</td>
                <td>{row.Location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">Loading data...</td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>    
    </Container>
  );
};

export default CsvDashboard;
















































































