import type { Server } from "socket.io";
import { registerProjectHandlers } from "./handlers/projectHandler";

// Initializes Socket.IO connection and registers all event handlers
export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Register feature-specific handlers
    registerProjectHandlers(io, socket);

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
