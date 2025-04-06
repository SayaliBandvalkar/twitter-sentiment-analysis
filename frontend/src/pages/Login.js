import React, { useState } from "react";
import axios from "axios";
import '../styles/Login.css';

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For handling loading state
  const [errorMessage, setErrorMessage] = useState(""); // To display server error messages

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading
    setErrorMessage(""); // Clear previous error messages

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        }
      );

      // Handle successful login
      console.log(response.data); // Log server response for debugging
      alert("Login Successful!");

    } catch (error) {
      // Handle error from the server
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Login failed.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Ensure the email field is required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Ensure the password field is required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"} {/* Display loading text */}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
