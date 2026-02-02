import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminDataMaintenance = createContext();

export const AdminDataProvider = ({ children }) => {
    const[allraiserequest,setAllraiserequest]=useState([])
    // console.log(allraiserequest)
    const[alltechnicians,setAlltechnicians]=useState([])
    useEffect(()=>{
        axios.get("http://localhost:5000/api/allraiserequest")
        .then((res)=>{
            // console.log(res.data)
            setAllraiserequest(res.data)

        })
        .catch((err)=>{
            console.log(err.message)
        })

    },[])
    useEffect(()=>{
        axios.get("http://localhost:5000/api/findtechnicians")
        .then((res)=>{
            // console.log(res.data)
            setAlltechnicians(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })

    },[])
    


  return (
    <AdminDataMaintenance.Provider value={{allraiserequest,setAllraiserequest,alltechnicians,setAlltechnicians}}>
      {children}
    </AdminDataMaintenance.Provider>
  );
};

export const AdminData = () => {
  const context = useContext(AdminDataMaintenance);
  if (!context) {
    throw new Error("useUserAsset must be used within a UserAssetProvider");
  }
  return context;
};

export default AdminDataProvider;
