
import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // Update user after profile changes
  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("profile-updated", updateUser);

    return () => {
      window.removeEventListener("profile-updated", updateUser);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

      {/* Logo */}
      <Link to="/inbox" className="text-2xl font-bold text-blue-500">
        MailSphere
      </Link>

      {/* User Actions */}
      <div className="flex items-center gap-5">

        {/* User Name */}
        <span className="text-slate-300">
          {user.name || "User"}
        </span>

        {/* Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition"
        >
          <User size={18} />
          Profile
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
