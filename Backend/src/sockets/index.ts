import type { Server } from "socket.io";
import { registerProjectHandlers } from "./handlers/projectHandler";
import { registerTypingHandlers } from "./handlers/typingHandler";
import { registerMessageHandlers } from "./handlers/messageHandler";

// Initializes Socket.IO connection and registers all event handlers
export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Register feature-specific handlers
    registerProjectHandlers(io, socket);
    registerTypingHandlers(io, socket);
    registerMessageHandlers(io, socket);
    
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
