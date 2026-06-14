import type { Server, Socket } from "socket.io";
import { prisma } from "../../lib/prisma";

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

  socket.on("project-message", async (message: { projectId: string; userId: string; content: string; [key: string]: unknown }) => {
    try {
      // Save to database
      const savedMessage = await prisma.message.create({
        data: {
          content: message.content,
          projectId: message.projectId,
          userId: message.userId,
        },
        include: {
          user: { select: { id: true, name: true } },
        },
      });

      // Broadcast to all clients in the project room
      io.to(message.projectId).emit("message-from-server", savedMessage);
      console.log("Message saved and broadcasted:", savedMessage);
    } catch (error) {
      console.error("Failed to save message:", error);
      socket.emit("message-error", { error: "Failed to save message" });
    }
  });
};
