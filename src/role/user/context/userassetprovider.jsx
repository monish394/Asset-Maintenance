import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserAssetContext = createContext();

export const UserAssetProvider = ({ children }) => {
  const [myasset, setMyasset] = useState([]);
  const [myraiserequest,setMyraiserequest]=useState([])

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/userassets", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setMyasset(res.data))
      .catch((err) => console.log(err.message));


  }, []);
  useEffect(()=>{
    axios.get("http://localhost:5000/api/userraiserequest",{headers:{Authorization:localStorage.getItem("token")}})
      .then((res) =>{ setMyraiserequest(res.data)})
      .catch((err) => console.log(err.message));
  },[])

  return (
    <UserAssetContext.Provider value={{ myasset, setMyasset,myraiserequest,setMyraiserequest }}>
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
