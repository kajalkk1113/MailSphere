import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";

import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { socketAuthMiddleware } from "./middleware/socketAuthMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Express middleware
app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Email Application Backend Running");
});

// Error middleware
app.use(errorMiddleware);

// HTTP Server
const server = createServer(app);

// Socket.IO setup
const io = initSocket(server);

// Socket authentication middleware
io.use(socketAuthMiddleware);

// Socket connection
io.on("connection", (socket) => {
  const userId = socket.user._id.toString();

  // User-specific private room
  socket.join(`user:${userId}`);

  console.log(`User connected: ${socket.user.email}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.email}`);
  });
});

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});