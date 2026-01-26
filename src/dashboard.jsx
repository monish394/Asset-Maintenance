import axios from "axios"
import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
// import Admin from "./role/Admin/assets/admin"
import Admin from "./role/Admin/components/admin"
// import User from "./role/user/user"
import UserHome from "./role/user/components/home"
import Technician from "./role/Technician/technician"



// import RaiseRequest from "./role/user/components/raiserequest"
export default function Dashboard() {
    const navigate=useNavigate()
    const [role,setRole]=useState("")
       
    
    // const token=localStorage.getItem("token");
    // const [user, setUser] = useState(null)
    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            navigate("/",{replace:true})
            return;

        }
        axios.get("http://localhost:5000/api/dashboardroute",{
            headers:{Authorization:localStorage.getItem("token")}
        })
        .then((res)=>{
            console.log(res.data)
            localStorage.setItem("role",res.data.role)
            // setUser(res.data)
            setRole(res.data.role)

        })
    },[])
  

    return(<>
       {/* <div> */}
  {/* <p className="text-center text-blue-400">Dashboard Component</p>
 
  {user && (
    <div className="text-center">
      <p>Id: {user._id}</p>
      <p>Role: {user.role}</p>
      <p>Email: {user.email}</p>
      <h4>{role}- dashboard</h4>
    </div>
  )}
  <button id="logout-btn"  onClick={()=>{
    localStorage.removeItem("token")
    navigate("/")
  }} style={{border:"1px solid black",padding:"5px",marginLeft:"48%",borderRadius:"10px",backgroundColor:"blue",color:"white"}}>Logout</button>
</div> */}
 <div>
    {
        role==="admin" && <Admin></Admin>
    }
    {
  role === "user" && (
  
      <UserHome />

  )
}

    {
        role==="technician" && <Technician/>
    }

 </div>
 </>
    )
  
    
}