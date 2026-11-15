
import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import {
  Mail,
  Trash2,
  RefreshCw,
  Star,
  MailOpen,
  MailCheck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import EmailVoicePlayer from "../components/EmailVoicePlayer";
import EmailSearch from "../components/EmailSearch";

function Inbox() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchParams, setSearchParams] = useState({
    search: "",
    filter: "all",
    sort: "newest",
  });

  // Fetch Inbox
  const fetchInbox = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await API.get("/emails/search", {
        params: {
          ...searchParams,
          folder: "inbox",
        },
      });

      setEmails(response.data.emails || []);
    } catch (error) {
      console.error("Inbox error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load inbox"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchParams]);

  // Initial Fetch + Search + Filter + Sort
  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  // Real-time inbox refresh
  useEffect(() => {
    const refreshInbox = () => {
      fetchInbox(true);
    };

    window.addEventListener("new-email-received", refreshInbox);

    return () => {
      window.removeEventListener("new-email-received", refreshInbox);
    };
  }, [fetchInbox]);

  // Open Email
  const openEmail = async (id) => {
    try {
      const response = await API.get(`/emails/${id}`);
      const email = response.data.email;

      setSelectedEmail(email);

      setEmails((previousEmails) =>
        previousEmails.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );

      window.dispatchEvent(new Event("email-read-status-changed"));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to open email"
      );
    }
  };

  // Mark Email Unread
  const handleMarkUnread = async (id) => {
    try {
      const response = await API.patch(`/emails/${id}/unread`);
      const updatedEmail = response.data.email;

      setEmails((previousEmails) =>
        previousEmails.map((item) =>
          item._id === id ? { ...item, isRead: false } : item
        )
      );

      setSelectedEmail(updatedEmail);

      window.dispatchEvent(new Event("email-read-status-changed"));

      toast.success("Email marked as unread");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark email unread"
      );
    }
  };

  // Toggle Star
  const handleToggleStar = async (id) => {
    try {
      const response = await API.patch(`/emails/${id}/star`);
      const updatedEmail = response.data.email;

      setEmails((previousEmails) =>
        previousEmails.map((item) =>
          item._id === id
            ? { ...item, isStarred: updatedEmail.isStarred }
            : item
        )
      );

      if (selectedEmail?._id === id) {
        setSelectedEmail(updatedEmail);
      }

      toast.success(
        updatedEmail.isStarred ? "Email starred" : "Email unstarred"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update star"
      );
    }
  };

  // Delete Email
  const handleDelete = async (id) => {
    try {
      await API.delete(`/emails/${id}`);

      setEmails((previousEmails) =>
        previousEmails.filter((email) => email._id !== id)
      );

      if (selectedEmail?._id === id) {
        setSelectedEmail(null);
      }

      window.dispatchEvent(new Event("email-read-status-changed"));

      toast.success("Email deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete email"
      );
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-slate-400">
        <RefreshCw className="animate-spin mr-3" size={20} />
        Loading inbox...
      </div>
    );
  }

  return (
    <div className="text-white space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-slate-400 mt-1">
            {emails.length} emails received
          </p>
        </div>

        <button
          onClick={() => fetchInbox(true)}
          disabled={refreshing}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50"
          title="Refresh Inbox"
        >
          <RefreshCw
            size={20}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Search, Filter & Sort */}
      <EmailSearch onSearch={setSearchParams} />

      {/* Email List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        {emails.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Mail size={45} className="mx-auto mb-3" />

            <p className="text-lg">
              No emails found
            </p>

            <p className="text-sm mt-1">
              Try another search or filter
            </p>
          </div>
        ) : (
          emails.map((email) => (
            <div
              key={email._id}
              className={`flex items-center gap-3 p-5 border-b border-slate-800 hover:bg-slate-800 transition ${
                email.isRead ? "bg-slate-900" : "bg-slate-800/60"
              }`}
            >
              {/* Email Content */}
              <button
                onClick={() => openEmail(email._id)}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-2">
                  {email.isRead ? (
                    <MailOpen size={16} className="text-slate-500" />
                  ) : (
                    <MailCheck size={16} className="text-blue-400" />
                  )}

                  <p
                    className={`truncate ${
                      email.isRead
                        ? "text-slate-400"
                        : "font-bold text-white"
                    }`}
                  >
                    {email.sender?.name || email.sender?.email}
                  </p>
                </div>

                <p
                  className={`mt-2 truncate ${
                    email.isRead
                      ? "text-slate-400"
                      : "font-semibold text-white"
                  }`}
                >
                  {email.subject}
                </p>

                <p className="text-sm text-slate-500 mt-1 truncate">
                  {email.message}
                </p>
              </button>

              {/* Star */}
              <button
                onClick={() => handleToggleStar(email._id)}
                className={`p-2 transition ${
                  email.isStarred
                    ? "text-yellow-400"
                    : "text-slate-500 hover:text-yellow-400"
                }`}
                title={email.isStarred ? "Unstar email" : "Star email"}
              >
                <Star
                  size={18}
                  fill={email.isStarred ? "currentColor" : "none"}
                />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(email._id)}
                className="p-2 text-slate-400 hover:text-red-400 transition"
                title="Delete email"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Email Details */}
      {selectedEmail && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          {/* Details Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold break-words">
                  {selectedEmail.subject}
                </h2>

                <p className="text-slate-400 mt-3">
                  From: {selectedEmail.sender?.name} (
                  {selectedEmail.sender?.email})
                </p>

                <p className="text-slate-400 mt-1">
                  To: {selectedEmail.receiver?.email}
                </p>
              </div>

              <button
                onClick={() => setSelectedEmail(null)}
                className="text-slate-400 hover:text-white p-1"
                title="Close email"
              >
                <X size={22} />
              </button>
            </div>

            {/* Email Actions */}
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={() => handleMarkUnread(selectedEmail._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-sm"
              >
                <Mail size={16} />
                Mark as Unread
              </button>

              <button
                onClick={() => handleToggleStar(selectedEmail._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm ${
                  selectedEmail.isStarred
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <Star
                  size={16}
                  fill={selectedEmail.isStarred ? "currentColor" : "none"}
                />
                {selectedEmail.isStarred ? "Unstar" : "Star"}
              </button>

              <button
                onClick={() => handleDelete(selectedEmail._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>

          {/* Email Message */}
          <div className="p-6">
            <p className="text-slate-300 whitespace-pre-wrap leading-8">
              {selectedEmail.message}
            </p>

            <EmailVoicePlayer email={selectedEmail} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Inbox;
