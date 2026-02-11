import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TechDataMaintain = createContext();

export const TechDataProvider = ({ children }) => {
  const [requests,setRequests]=useState([])
  // console.log(requests)
     const[technicianassignedassert,setTechnicianassignedassert]=useState([])
     const[techniciansnotifications,setTechniciansnotifications]=useState([])
     const [techinfo,setTechinfo]=useState(null)
     console.log(techinfo)
    console.log(localStorage.getItem("token"))
        useEffect(() => {
      axios
        .get("http://localhost:5000/api/alltechnicianrequest", {
          headers: { Authorization:localStorage.getItem("token") },
        })
        .then((res) =>{ setTechnicianassignedassert(res.data)
            // console.log(res.data)
        })
        .catch((err) => console.log(err.message));
    }, []);

       useEffect(()=>{
      axios.get("http://localhost:5000/api/techniciansnotifications",{
        headers:{
          Authorization:localStorage.getItem("token")
        }
      })
      .then((res)=>{
        // console.log(res.data)
        setTechniciansnotifications(res.data)
      })
      .catch((err)=>{
        console.log(err.message)
      })

    },[])
    useEffect(() => {
  axios.get("http://localhost:5000/api/userinfo", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  })
  .then(res => setTechinfo(res.data))
  .catch(err => console.log(err.message))
}, [])


useEffect(() => {
  axios.get("http://localhost:5000/api/technician/general-requests", {
    headers: { Authorization: localStorage.getItem("token") }
  })
  .then(res =>{
    // console.log(res.data)
     setRequests(res.data)}
    )
    .catch((err)=>{
      console.log(err)
    })
}, [])


    
   
    

  return (
    <TechDataMaintain.Provider value={{technicianassignedassert,setTechnicianassignedassert,techniciansnotifications,techinfo,requests,setRequests}}>
      {children}
    </TechDataMaintain.Provider>
  );
};

export const TechData = () => {
  const context = useContext(TechDataMaintain);
  if (!context) {
    throw new Error("useUserAsset must be used within a UserAssetProvider");
  }
  return context;
};

export default TechDataProvider;
