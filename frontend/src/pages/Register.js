import React, { useState } from "react";
import axios from "axios";
import '../styles/Register.css';

function RegisterForm() {
  const [username, setUsername] = useState("");  // Updated from 'name' to 'username'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // For handling loading state
  const [errorMessage, setErrorMessage] = useState(""); // For error messages
  const [successMessage, setSuccessMessage] = useState(""); // For success messages

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading
    setErrorMessage(""); // Clear error message
    setSuccessMessage(""); // Clear success message

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        username,  // Changed from 'name' to 'username'
        email,
        password,
      });

      // Handle successful registration
      console.log(response.data);
      setSuccessMessage("Registration Successful!");
      setUsername(""); // Clear form fields
      setEmail("");
      setPassword("");
    } catch (error) {
      // Handle error from the server
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Registration failed.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <input
          type="text"
          placeholder="Enter Username"  // Adjusted to 'Username'
          value={username}  // Use 'username' instead of 'name'
          onChange={(e) => setUsername(e.target.value)}  // Use 'setUsername' instead of 'setName'
          required
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
