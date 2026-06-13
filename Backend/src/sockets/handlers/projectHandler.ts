import type { Server, Socket } from "socket.io";

// Registers all project-related socket event handlers for a connected socket
export const registerProjectHandlers = (io: Server, socket: Socket) => {
  socket.on("join-project", (projectId: string, userId: string) => {
    console.log(`User ${userId} joined project ${projectId}`);
    socket.join(projectId);
  });

  socket.on("leave-project", (projectId: string, userId: string) => {
    console.log(`User ${userId} left project ${projectId}`);
    socket.leave(projectId);
  });

  socket.on("project-message", (message: { projectId: string; [key: string]: unknown }) => {
    console.log("Received project message:", message);
    io.to(message.projectId).emit("message-from-server", message);
  });
};
