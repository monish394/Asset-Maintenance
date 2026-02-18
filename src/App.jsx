import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./logrespage/Login";
import Register from "./logrespage/Registration";
import { Toaster } from "sonner";
import Dashboard from "./dashboard.jsx";

//public routes
import Publichome from "./logrespage/Home.jsx"

//admin page
import AdminDataProvider from "./role/Admin/context/Admindatamaintenance.jsx";
import Admin from "./role/Admin/components/admin.jsx";
import Assets from "./role/Admin/components/assets.jsx";
import WorkOrder from "./role/Admin/components/workorder.jsx";
import User from "./role/Admin/components/user.jsx";
import Technician from "./role/Admin/components/technician.jsx";
import AdminLayout from "./role/Admin/components/adminlayout.jsx";
import Maintenance from "./role/Admin/components/maintenance.jsx";

//user page
//contexy
import { UserAssetProvider } from "./role/user/context/userassetprovider.jsx";
import UserLayout from "./role/user/components/userlayout.jsx";
import Home from "./role/user/components/home.jsx";
import RaiseRequest from "./role/user/components/raiserequest.jsx";
import Payment from "./role/user/components/payment.jsx";
import WorkOrderRequest from "./role/user/components/workorderrequest.jsx";

//techniican page
import TechDataProvider from "./role/Technician/context/Techniciandatamaintenance.jsx";
import TechnicianLayout from "./role/Technician/components/technicianlayout.jsx";
import TechnicianHome from "./role/Technician/components/technicianhome.jsx";
import AssignedRequest from "./role/Technician/components/assignedrequest.jsx";
import RequestDetails from "./role/Technician/components/requestdetails.jsx";
import ServiceHistory from "./role/Technician/components/servicehistory.jsx";
import PickAssets from "./role/user/components/Assets.jsx";
export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        {/*public route*/}
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Publichome />} />


        {/* admin route */}
        <Route path="/admin" element={<AdminDataProvider><AdminLayout /></AdminDataProvider>}>
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<Admin />} />
          <Route path="assets" element={<Assets />} />
          <Route path="workorders" element={<WorkOrder />} />
          <Route path="users" element={<User />} />
          <Route path="technicians" element={<Technician />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>

        {/* user route */}
        <Route path="/user" element={ <UserAssetProvider><UserLayout /></UserAssetProvider>}>
          <Route index element={<Navigate to="home" />} />

          <Route path="home" element={<Home />} />
          <Route path="pickassets" element={<PickAssets />} />

          <Route path="raiserequest" element={<RaiseRequest />} />
          <Route path="payment" element={<Payment />} />
          <Route path="workorderrequest" element={<WorkOrderRequest />} />
        </Route>

        {/* technician route */}
         <Route path="/technician" element={<TechDataProvider><TechnicianLayout /></TechDataProvider>}>
          <Route index element={<Navigate to={<TechnicianHome/>}/>} />

          <Route path="home" element={<TechnicianHome />} />
          <Route path="assignedrequest" element={<AssignedRequest />} />
          <Route path="requestdetails" element={<RequestDetails />} />
          <Route path="service" element={<ServiceHistory />} />
        </Route>

        <></>




      </Routes>



    </>



  )
}
