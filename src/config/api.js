import axios from "axios";

const axiosInstance = axios.create({
    // For production, "/api" is the correct way to hit the same server
    baseURL: "https://asset-maintenance.onrender.com/api" 
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