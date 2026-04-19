// src/config.js
const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://expertcomputers-backend.onrender.com";

export default API_BASE_URL;