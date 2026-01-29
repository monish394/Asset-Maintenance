import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TechDataMaintain = createContext();

export const TechDataProvider = ({ children }) => {
     const[technicianassignedassert,setTechnicianassignedassert]=useState([])
     const[techniciansnotifications,setTechniciansnotifications]=useState([])
    
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


    
   
    

  return (
    <TechDataMaintain.Provider value={{technicianassignedassert,setTechnicianassignedassert,techniciansnotifications}}>
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
