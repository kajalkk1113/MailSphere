import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inbox from "./pages/Inbox";
import Sent from "./pages/Sent";
import Compose from "./pages/Compose";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
  <Toaster position="top-right" />
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="sent" element={<Sent />} />
          <Route path="compose" element={<Compose />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;