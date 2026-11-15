import express from "express";

import {
  sendEmailController,
  getInboxEmails,
  getSentEmails,
  getUnreadCount,
  getSingleEmail,
  deleteEmail,
  markEmailAsRead,
  markEmailAsUnread,
  searchEmails
} from "../controllers/emailController.js";

import { protect } from "../middleware/authMiddleware.js";
import { validateEmail } from "../middleware/validateEmail.js";

const router = express.Router();

// Send Email
router.post(
  "/send",
  protect,
  validateEmail,
  sendEmailController
);


router.get("/inbox", protect, getInboxEmails);

router.get("/search", protect, searchEmails);


router.get("/sent", protect, getSentEmails);


router.get("/unread-count", protect, getUnreadCount);


router.get("/:id", protect, getSingleEmail);
router.patch("/:id/read", protect, markEmailAsRead);

router.patch("/:id/unread", protect, markEmailAsUnread);

router.delete("/:id", protect, deleteEmail);

export default router;