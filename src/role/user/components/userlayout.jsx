import { Outlet } from "react-router-dom";
import UserNavbar from "./usernavbar";
import Footer from "./footer";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="flex-1 mt-24 p-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
