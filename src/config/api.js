import axios from "axios";

// In production (Render), the Express server serves both frontend and API
// on the same domain, so we use a relative path '/api'.
// In development, Vite's proxy forwards '/api' to localhost:5000.
const baseURL = import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "/api";

const axiosInstance = axios.create({
    baseURL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;