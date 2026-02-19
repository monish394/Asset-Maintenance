import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// import Admin from "./role/Admin/assets/admin"
import Admin from "./role/Admin/components/admin"
// import User from "./role/user/user"
import UserHome from "./role/user/components/home"
import Technician from "./role/Technician/technician"



// import RaiseRequest from "./role/user/components/raiserequest"
export default function Dashboard() {
    const navigate = useNavigate()
    const [role, setRole] = useState("")


    // const token=localStorage.getItem("token");
    // const [user, setUser] = useState(null)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true })
            return;

        }
        axios.get("http://localhost:5000/api/dashboardroute", {
            headers: { Authorization: localStorage.getItem("token") }
        })
            .then((res) => {
                console.log(res.data)
                localStorage.setItem("role", res.data.role)
                // setUser(res.data)
                setRole(res.data.role)

            })
    }, [])


    return (<>
        <div>
            {
                role === "admin" && <Admin></Admin>
            }
            {
                role === "user" && (

                    <UserHome />

                )
            }

            {
                role === "technician" && <Technician />
            }

        </div>
    </>
    )


}