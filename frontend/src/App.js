import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./components/About";
import Slider from "./components/Slider";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import TwitterDashboard from "./components/TwitterDashboard";
import PrivateRoute from "./components/PrivateRoute"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import CsvDashboard from "./components/csv-dashboard"; // Import CsvDashboard.js


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/slider" element={<Slider />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<PrivateRoute />}></Route>
        <Route path="/dashboard" element={<TwitterDashboard />} />
        <Route path="/dashboard" element={<PrivateRoute><TwitterDashboard /></PrivateRoute>} />
        <Route path="/csv-dashboard" element={<CsvDashboard />} />

        
      </Routes>
      <Footer />
    </Router>
  );
}


export default App;



