import axios from "axios";

const axiosInstance=axios.create({
    // baseURL:"http://localhost:5000/api"
    baseURL:"https://asset-maintenance-p7te.vercel.app"
})

export default axiosInstance