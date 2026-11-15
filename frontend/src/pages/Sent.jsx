
import { useEffect, useState } from "react";

import API from "../services/api";

import {
  Send,
  Trash2,
  RefreshCw,
  Star,
  X,
  Mail,
} from "lucide-react";

import toast from "react-hot-toast";

import EmailVoicePlayer from "../components/EmailVoicePlayer";

function Sent() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Sent Emails
  const fetchSentEmails = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await API.get("/emails/sent");

      setEmails(response.data.emails);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load sent emails"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchSentEmails();
  }, []);

  // Toggle Star
  const handleToggleStar = async (id) => {
    try {
      const response = await API.patch(
        `/emails/${id}/star`
      );

      const updatedEmail = response.data.email;

      setEmails((previousEmails) =>
        previousEmails.map((email) =>
          email._id === id
            ? {
                ...email,
                isStarred: updatedEmail.isStarred,
              }
            : email
        )
      );

      if (selectedEmail?._id === id) {
        setSelectedEmail(updatedEmail);
      }

      toast.success(
        updatedEmail.isStarred
          ? "Email starred"
          : "Email unstarred"
      );
    } catch (error) {
      toast.error("Failed to update star");
    }
  };

  // Delete Sent Email
  const handleDelete = async (id) => {
    try {
      await API.delete(`/emails/${id}`);

      setEmails((previousEmails) =>
        previousEmails.filter(
          (email) => email._id !== id
        )
      );

      if (selectedEmail?._id === id) {
        setSelectedEmail(null);
      }

      toast.success("Sent email deleted");
    } catch (error) {
      toast.error("Failed to delete email");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-slate-400">
        <RefreshCw
          className="animate-spin mr-3"
          size={20}
        />
        Loading sent emails...
      </div>
    );
  }

  return (
    <div className="text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Sent Emails
          </h1>

          <p className="text-slate-400 mt-1">
            {emails.length} emails sent
          </p>
        </div>

        <button
          onClick={() => fetchSentEmails(false)}
          disabled={refreshing}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          title="Refresh"
        >
          <RefreshCw
            size={20}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>

      </div>

      {/* Sent Email List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        {emails.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Send
              size={45}
              className="mx-auto mb-3"
            />

            <p className="text-lg">
              No sent emails yet
            </p>

            <p className="text-sm mt-1">
              Emails you send will appear here
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email._id}
              className="flex items-center gap-3 p-5 border-b border-slate-800 hover:bg-slate-800 transition"
            >

              {/* Email Content */}
              <button
                onClick={() => setSelectedEmail(email)}
                className="flex-1 text-left min-w-0"
              >

                <div className="flex items-center gap-2">

                  <Send
                    size={16}
                    className="text-blue-400"
                  />

                  <p className="text-slate-300 truncate">
                    To:{" "}
                    {email.receiver?.name ||
                      email.receiver?.email}
                  </p>

                </div>

                <p className="mt-2 font-semibold text-white truncate">
                  {email.subject}
                </p>

                <p className="text-sm text-slate-500 mt-1 truncate">
                  {email.message}
                </p>

              </button>

              {/* Star */}
              <button
                onClick={() =>
                  handleToggleStar(email._id)
                }
                className={`p-2 ${
                  email.isStarred
                    ? "text-yellow-400"
                    : "text-slate-500 hover:text-yellow-400"
                }`}
                title="Star email"
              >
                <Star
                  size={18}
                  fill={
                    email.isStarred
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              {/* Delete */}
              <button
                onClick={() =>
                  handleDelete(email._id)
                }
                className="p-2 text-slate-400 hover:text-red-400"
                title="Delete email"
              >
                <Trash2 size={18} />
              </button>

            </div>
          ))
        )}

      </div>

      {/* Sent Email Details */}
      {selectedEmail && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <div className="flex justify-between items-start gap-4">

              <div className="min-w-0">

                <h2 className="text-2xl font-bold break-words">
                  {selectedEmail.subject}
                </h2>

                <p className="text-slate-400 mt-3">
                  From:{" "}
                  {selectedEmail.sender?.email}
                </p>

                <p className="text-slate-400 mt-1">
                  To:{" "}
                  {selectedEmail.receiver?.name} (
                  {selectedEmail.receiver?.email})
                </p>

              </div>

              <button
                onClick={() => setSelectedEmail(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            <div className="flex flex-wrap gap-3 mt-5">

              <button
                onClick={() =>
                  handleToggleStar(selectedEmail._id)
                }
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
              >
                <Star
                  size={16}
                  fill={
                    selectedEmail.isStarred
                      ? "currentColor"
                      : "none"
                  }
                />

                {selectedEmail.isStarred
                  ? "Unstar"
                  : "Star"}
              </button>

              <button
                onClick={() =>
                  handleDelete(selectedEmail._id)
                }
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>

          </div>

          {/* Message */}
          <div className="p-6">

            <p className="text-slate-300 whitespace-pre-wrap leading-8 break-words">
              {selectedEmail.message}
            </p>

            {/* Voice Player */}
            <EmailVoicePlayer email={selectedEmail} />

          </div>

        </div>
      )}

    </div>
  );
}

export default Sent;
