import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../../config/api";

const UserAssetContext = createContext();

export const UserAssetProvider = ({ children }) => {
  const [userinfo,setUserinfo]=useState(null)
  const [usergeneralrequest,setUsergeneralrequest]=useState([])

  // console.log(userinfo)

  
  const token=localStorage.getItem("token")
  const [myasset, setMyasset] = useState([]);
  const [myraiserequest,setMyraiserequest]=useState([])
  const [usernotifications,setUsernotifications]=useState([])

  useEffect(() => {
    axios
      .get("/userassets", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setMyasset(res.data))
      .catch((err) => console.log(err.message));


  }, []);
  useEffect(()=>{
    axios.get("/userraiserequest",{headers:{Authorization:localStorage.getItem("token")}})
      .then((res) =>{ setMyraiserequest(res.data)})
      .catch((err) => console.log(err.message));
  },[])
  useEffect(()=>{
  axios.get("/usersnotifications",{
    headers:{Authorization:token}
  })
  .then((res)=>{
    setUsernotifications(res.data)
    console.log(res.data)
  })
  .catch((err)=>{
    console.log(err.message)
  })

},[])
useEffect(() => {
  axios.get("/userinfo", {
    headers: {
      Authorization: token
    }
  })
  .then(res => setUserinfo(res.data))
  .catch(err => console.log(err.message))
}, [])

useEffect(()=>{
  axios.get("/usergeneralrequest",{
    headers:{
      Authorization:token
    }
  })
  .then((res)=>{
    // console.log(res.data)
    setUsergeneralrequest(res.data)
  })
  .catch((err)=>{
    console.log(err.message)
  })

},[])

  return (
    <UserAssetContext.Provider value={{ myasset, setMyasset,myraiserequest,setMyraiserequest,usernotifications,setUsernotifications,userinfo,setUserinfo,usergeneralrequest,setUsergeneralrequest }}>
      {children}
    </UserAssetContext.Provider>
  );
};

export const useUserAsset = () => {
  const context = useContext(UserAssetContext);
  if (!context) {
    throw new Error("useUserAsset must be used within a UserAssetProvider");
  }
  return context;
};

export default UserAssetContext;
