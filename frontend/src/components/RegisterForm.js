

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css"; // Import the external CSS file

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", formData);
      alert(response.data.message);
      setFormData({ name: "", email: "", password: "" });
      setError("");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "An error occurred");
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Sign up to TweetHub</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
