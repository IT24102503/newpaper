// Change this to your deployed backend URL before deploying frontend
// Example: const API_BASE_URL = "https://your-backend.onrender.com/api";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default API_BASE_URL;