import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../../config/api";

const TechDataMaintain = createContext();

export const TechDataProvider = ({ children }) => {
  const [requests, setRequests] = useState([])
  // console.log(requests)
  const [technicianassignedassert, setTechnicianassignedassert] = useState([])
  const [techniciansnotifications, setTechniciansnotifications] = useState([])
  const [techinfo, setTechinfo] = useState(null)
  console.log(techinfo)
  console.log(localStorage.getItem("token"))
  useEffect(() => {
    axios.get("/alltechnicianrequest")
      .then((res) => setTechnicianassignedassert(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  useEffect(() => {
    axios.get("/techniciansnotifications")
      .then((res) => setTechniciansnotifications(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  useEffect(() => {
    axios.get("/userinfo")
      .then(res => setTechinfo(res.data))
      .catch(err => console.log(err.message));
  }, []);

  useEffect(() => {
    axios.get("/technician/general-requests")
      .then(res => setRequests(res.data))
      .catch((err) => console.log(err));
  }, []);

  const markTechNotificationsAsRead = async () => {
    try {
      await axios.put("/notifications/mark-all-read");
      setTechniciansnotifications(prev => prev.map(n => ({ ...n, isread: true })));
    } catch (err) {
      console.log("Failed to mark all as read:", err.message);
    }
  };

  const markSingleTechNotificationAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setTechniciansnotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isread: true } : n)
      );
    } catch (err) {
      console.log("Failed to mark single as read:", err.message);
    }
  };

  return (
    <TechDataMaintain.Provider value={{
      technicianassignedassert, setTechnicianassignedassert,
      techniciansnotifications, setTechniciansnotifications,
      techinfo, setTechinfo,
      requests, setRequests,
      markTechNotificationsAsRead,
      markSingleTechNotificationAsRead
    }}>
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