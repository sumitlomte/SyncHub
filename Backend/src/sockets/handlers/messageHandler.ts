import type { Server, Socket } from "socket.io";
import { prisma } from "../../lib/prisma";

interface MessageData {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  projectId: string;
}

// Registers all message-related socket event handlers for a connected socket
export const registerMessageHandlers = (io: Server, socket: Socket) => {
  socket.on(
    "send-message",
    async (messageData: MessageData, callback: (error?: string) => void) => {
      try {
        // Validate required fields
        if (!messageData.userId || typeof messageData.userId !== "string") {
          return callback("Invalid or missing userId");
        }

        if (!messageData.projectId || typeof messageData.projectId !== "string") {
          return callback("Invalid or missing projectId");
        }

        if (
          !messageData.content ||
          typeof messageData.content !== "string" ||
          messageData.content.trim().length === 0
        ) {
          return callback("Message content cannot be empty");
        }

        if (!messageData.userName || typeof messageData.userName !== "string") {
          return callback("Invalid or missing userName");
        }

        // Validate userId exists
        const user = await prisma.user.findUnique({
          where: { id: messageData.userId },
        });

        if (!user) {
          return callback("User not found");
        }

        // Validate project exists
        const project = await prisma.project.findUnique({
          where: { id: messageData.projectId },
        });

        if (!project) {
          return callback("Project not found");
        }

        // Check user has permission to send messages in this project
        // User must be either the project owner or a team member
        const isProjectOwner = project.userId === messageData.userId;

        if (!isProjectOwner) {
          const teamMember = await prisma.teamMember.findFirst({
            where: {
              projectId: messageData.projectId,
              userId: messageData.userId,
            },
          });

          if (!teamMember) {
            return callback(
              "You do not have permission to send messages in this project"
            );
          }
        }

        // Save message to database
        const savedMessage = await prisma.message.create({
          data: {
            content: messageData.content,
            projectId: messageData.projectId,
            userId: messageData.userId,
          },
          include: {
            user: { select: { id: true, name: true } },
            project: { select: { id: true } },
          },
        });

        // Send acknowledgement to sender (success - no error argument)
        callback();

        // Broadcast to all users in the project room
        // Include the saved message with server timestamp for consistency
        const broadcastData = {
          id: savedMessage.id,
          userId: savedMessage.userId,
          userName: savedMessage.user.name,
          content: savedMessage.content,
          timestamp: savedMessage.createdAt,
          projectId: savedMessage.projectId,
        };

        socket.to(messageData.projectId).emit("message-from-server", broadcastData);
        console.log(`Message saved and broadcasted to project ${messageData.projectId}:`, broadcastData);
      } catch (error) {
        console.error("Failed to save message:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save message";
        callback(errorMessage);
      }
    }
  );
};
