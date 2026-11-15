
import { useEffect } from "react";
import toast from "react-hot-toast";

import {
  connectSocket,
  disconnectSocket,
} from "../services/socket";

import { speakText } from "../utils/speech";

function SocketNotifications() {
  useEffect(() => {
    const socket = connectSocket();

    if (!socket) return;

    const handleNewEmail = (data) => {
      toast.success(
        `New email from ${data.sender.name}: ${data.subject}`,
        {
          duration: 5000,
        }
      );

      // Voice notification
      speakText(
        `You have a new email from ${data.sender.name}. Subject: ${data.subject}`
      );

      // Refresh inbox and unread counter
      window.dispatchEvent(
        new Event("new-email-received")
      );
    };

    socket.on("newEmail", handleNewEmail);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("newEmail", handleNewEmail);
      socket.off("connect");
      socket.off("connect_error");

      disconnectSocket();
    };
  }, []);

  return null;
}

export default SocketNotifications;
