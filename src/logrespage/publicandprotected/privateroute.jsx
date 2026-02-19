import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function PrivateRoute(props) {

    const navigate=useNavigate();
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            return navigate("/login")
        }

    },[])
    // if(!localStorage.getItem("/token")){
    //     return <p>Loading...</p>
    // }

    return props.children
    
    
}