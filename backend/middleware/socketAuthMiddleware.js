import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Frontend se token receive hoga
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    // JWT verify karna
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Database se user find karna
    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    // Socket par authenticated user store karna
    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
};