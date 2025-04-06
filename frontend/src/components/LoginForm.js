
import React, { useState } from "react";
import { Link,useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import the external CSS file

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = { email, password };
      const response = await axios.post("http://127.0.0.1:5000/login", formData);

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token); // Store token
        const redirectTo = location.state?.from || '/dashboard';
        navigate(redirectTo);
        alert(response.data.message);
        navigate("/dashboard"); // Redirect to TwitterDashboard.js
      } else {
        alert("Unexpected error occurred.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Invalid login credentials.");
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-white">Sign in to TweetHub</h2>
        <div className="mb-3">
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Phone, email, or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="spinner-border spinner-border-sm" /> : "Next"}
            </button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-decoration-none">
            Forget password?
          </Link>
        </div>
        <div className="text-center mt-3 text-white">
          Don’t have an account?{" "}
          <Link to="/register" className="text-decoration-none">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
