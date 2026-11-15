
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Paperclip, ArrowLeft } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

function Compose() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/emails/send", formData);

      toast.success("Email sent successfully!");

      setFormData({
        to: "",
        subject: "",
        message: "",
      });

      navigate("/sent");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/inbox")}
          className="p-2 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-bold">Compose Email</h1>
          <p className="text-slate-400 mt-1">
            Write and send a new message
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSend}
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
      >

        {/* Receiver */}
        <div className="border-b border-slate-800 px-6 py-4">
          <label className="text-slate-400 text-sm block mb-2">
            To
          </label>

          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="receiver@example.com"
            required
            className="w-full bg-transparent outline-none text-white placeholder:text-slate-600"
          />
        </div>

        {/* Subject */}
        <div className="border-b border-slate-800 px-6 py-4">
          <label className="text-slate-400 text-sm block mb-2">
            Subject
          </label>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter email subject"
            required
            className="w-full bg-transparent outline-none text-white placeholder:text-slate-600"
          />
        </div>

        {/* Message */}
        <div className="px-6 py-4">
          <label className="text-slate-400 text-sm block mb-2">
            Message
          </label>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
            rows={12}
            className="w-full bg-transparent outline-none resize-y text-white placeholder:text-slate-600 leading-7"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between bg-slate-950/50 border-t border-slate-800 px-6 py-4">

          <button
            type="button"
            className="flex items-center gap-2 text-slate-400 hover:text-white"
            title="Attachments coming soon"
          >
            <Paperclip size={18} />
            <span className="text-sm">Attachment</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send Email"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default Compose;
