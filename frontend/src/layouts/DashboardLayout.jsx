import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SocketNotifications from "../components/SocketNotifications";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
        <SocketNotifications/>
        
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)]">

        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;