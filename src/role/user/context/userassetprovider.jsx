import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../../config/api";

const UserAssetContext = createContext();

export const UserAssetProvider = ({ children }) => {
  const [userinfo, setUserinfo] = useState(null)
  const [usergeneralrequest, setUsergeneralrequest] = useState([])

  // console.log(userinfo)


  const token = localStorage.getItem("token")
  const [myasset, setMyasset] = useState([]);
  const [myraiserequest, setMyraiserequest] = useState([])
  const [usernotifications, setUsernotifications] = useState([])

  useEffect(() => {
    axios
      .get("/userassets")
      .then((res) => setMyasset(res.data))
      .catch((err) => console.log(err.message));


  }, []);
  useEffect(() => {
    axios.get("/userraiserequest")
      .then((res) => { setMyraiserequest(res.data) })
      .catch((err) => console.log(err.message));
  }, [])
  useEffect(() => {
    axios.get("/usersnotifications")
      .then((res) => {
        setUsernotifications(res.data)
        // console.log(res.data)
      })
      .catch((err) => {
        console.log(err.message)
      })

  }, [])
  useEffect(() => {
    axios.get("/userinfo")
      .then(res => setUserinfo(res.data))
      .catch(err => console.log(err.message))
  }, [])

  useEffect(() => {
    axios.get("/usergeneralrequest")
      .then((res) => {
        // console.log(res.data)
        setUsergeneralrequest(res.data)
      })
      .catch((err) => {
        console.log(err.message)
      })

  }, [])

  const markNotificationsAsRead = async () => {
    try {
      await axios.put("/notifications/mark-all-read");
      setUsernotifications(prev => prev.map(n => ({ ...n, isread: true })));
    } catch (err) {
      console.log("Failed to mark all as read:", err.message);
    }
  };

  const markSingleNotificationAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setUsernotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isread: true } : n)
      );
    } catch (err) {
      console.log("Failed to mark single as read:", err.message);
    }
  };

  return (
    <UserAssetContext.Provider value={{
      myasset, setMyasset,
      myraiserequest, setMyraiserequest,
      usernotifications, setUsernotifications,
      userinfo, setUserinfo,
      usergeneralrequest, setUsergeneralrequest,
      markNotificationsAsRead,
      markSingleNotificationAsRead
    }}>
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
