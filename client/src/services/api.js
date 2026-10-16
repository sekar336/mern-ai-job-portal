import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://mern-ai-job-portal.onrender.com",
});

export default API;