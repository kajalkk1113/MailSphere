export const validateEmail = (req, res, next) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "To, subject and message are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(to)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (subject.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Subject cannot be empty",
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
    });
  }

  next();
};