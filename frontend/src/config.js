// src/config.js
const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://expertcomputers.onrender.com";

export default API_BASE_URL;