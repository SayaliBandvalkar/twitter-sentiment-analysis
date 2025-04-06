import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Define your backend base URL in .env file

// Function to handle login
/*export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Something went wrong!";
  }
};*/
//import axios from "axios";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, credentials);
  return response.data;
};


// Function to handle registration
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Something went wrong!";
  }
};
