
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Inbox,
  Send,
  PenSquare,
} from "lucide-react";

import API from "../services/api";

function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch Unread Count
  const fetchUnreadCount = async () => {
    try {
      const response = await API.get(
        "/emails/unread-count"
      );

      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Unread count error:", error);
    }
  };

  // Initial Fetch + Real-Time Update
  useEffect(() => {
    fetchUnreadCount();

    const refreshCount = () => {
      fetchUnreadCount();
    };

    window.addEventListener(
      "new-email-received",
      refreshCount
    );

    window.addEventListener(
      "email-read-status-changed",
      refreshCount
    );

    return () => {
      window.removeEventListener(
        "new-email-received",
        refreshCount
      );

      window.removeEventListener(
        "email-read-status-changed",
        refreshCount
      );
    };
  }, []);

  // Sidebar Menu Items
  const menuItems = [
    {
      name: "Inbox",
      path: "/inbox",
      icon: Inbox,
      count: unreadCount,
    },
    {
      name: "Sent",
      path: "/sent",
      icon: Send,
      count: 0,
    },
    {
      name: "Compose",
      path: "/compose",
      icon: PenSquare,
      count: 0,
    },
  ];

  return (
    <aside className="w-64 min-h-full bg-slate-900 border-r border-slate-800 p-5">

      {/* Compose Button */}
      <NavLink
        to="/compose"
        className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl mb-8 font-semibold transition"
      >
        + Compose Email
      </NavLink>

      {/* Sidebar Navigation */}
      <div className="space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >

              {/* Icon + Name */}
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span>{item.name}</span>
              </div>

              {/* Unread Counter */}
              {item.count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                  {item.count}
                </span>
              )}

            </NavLink>
          );
        })}

      </div>

    </aside>
  );
}

export default Sidebar;
