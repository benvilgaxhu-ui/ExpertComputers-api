// src/config.js// 

// 'npm start' runs in development. 'npm run build' runs in production.
const API_BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://expertcomputers.onrender.com" 
    : "http://localhost:5000";

export default API_BASE_URL;