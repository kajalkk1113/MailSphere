import Email from "../models/Email.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";

export const sendEmailController = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Find receiver
    const receiver = await User.findOne({
      email: to.toLowerCase(),
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver is not registered",
      });
    }

    // Save email in MongoDB
    const email = await Email.create({
      sender: req.user._id,
      receiver: receiver._id,
      subject,
      message,
    });

try {
  const io = getIO();

  io.to(`user:${receiver._id.toString()}`).emit(
    "newEmail",
    {
      emailId: email._id,
      sender: {
        name: req.user.name,
        email: req.user.email,
      },
      subject: email.subject,
      createdAt: email.createdAt,
    }
  );

} catch (error) {
  console.error("Socket notification error:", error.message);
}

    res.status(201).json({
      message: "Email sent successfully",
      email,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

// Get Inbox Emails
export const getInboxEmails = async (req, res) => {
  try {
    const emails = await Email.find({
      receiver: req.user._id,
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Inbox fetched successfully",
      emails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch inbox",
      error: error.message,
    });
  }
};

// Get Sent Emails
export const getSentEmails = async (req, res) => {
  try {
    const emails = await Email.find({
      sender: req.user._id,
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Sent emails fetched successfully",
      emails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sent emails",
      error: error.message,
    });
  }
};

// Get Unread Email Count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Email.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};

export const getSingleEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    )
      .populate("sender", "name email")
      .populate("receiver", "name email");

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Email opened successfully",
      email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to open email",
      error: error.message,
    });
  }
};


// Delete Email
export const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    });

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Email deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete email",
      error: error.message,
    });
  }
};

export const markEmailAsRead = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Email marked as read",
      email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark email as read",
      error: error.message,
    });
  }
};

export const markEmailAsUnread = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: req.user._id,
      },
      {
        isRead: false,
      },
      {
        new: true,
      }
    );

    if (!email) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Email marked as unread",
      email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark email as unread",
      error: error.message,
    });
  }
};


export const searchEmails = async (req, res, next) => {
  try {
    const { search = "", folder = "inbox", filter = "all", sort = "newest" } = req.query;

    const userId = req.user._id;

    // Inbox or Sent emails
    const query =
      folder === "sent"
        ? { sender: userId }
        : { receiver: userId };

    // Read / Unread filter
    if (filter === "read") {
      query.isRead = true;
    } else if (filter === "unread") {
      query.isRead = false;
    } else if (filter === "starred") {
      query.isStarred = true;
    }

    // Search by subject or message
    if (search.trim()) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    // Sort emails
    const sortOption =
      sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const emails = await Email.find(query)
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    next(error);
  }
};
