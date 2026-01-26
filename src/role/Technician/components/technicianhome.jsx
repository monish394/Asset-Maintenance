import { useEffect } from "react";
import axios from "axios";
export default function TechnicianHome() {

    useEffect(() => {
  axios
    .get("http://localhost:5000/api/alltechnicianrequest", {
      headers: { Authorization:localStorage.getItem("token") },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.message));
}, []);


    return(
        <div>
            <h1>Technician Home page</h1>
        </div>
    )
    
}