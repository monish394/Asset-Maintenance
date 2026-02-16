import axios from "axios";

const axiosInstance=axios.create({
    // baseURL:"http://localhost:5000/api"
    baseURL:"https://6992a9ea4cfd8890fe76a07a--visionary-gelato-527133.netlify.app/api"
})

export default axiosInstance