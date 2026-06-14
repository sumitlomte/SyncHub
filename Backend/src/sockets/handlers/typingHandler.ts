import type { Server, Socket } from "socket.io";

// Map to track typing timeouts per user per project: projectId:userId -> timeoutId
const typingTimeouts = new Map<string, NodeJS.Timeout>();

// Registers all typing-related socket event handlers for a connected socket
export const registerTypingHandlers = (io: Server, socket: Socket) => {
  socket.on("typing", (data: { projectId: string; userId: string; userName: string }) => {
    console.log(`User ${data.userName} is typing in project ${data.projectId}`);
    
    // Broadcast typing event to all users in the project room
    socket.to(data.projectId).emit("user-typing", data);

    // Create a unique key for tracking this user's typing timeout
    const timeoutKey = `${data.projectId}:${data.userId}`;

    // Clear any existing timeout for this user
    if (typingTimeouts.has(timeoutKey)) {
      clearTimeout(typingTimeouts.get(timeoutKey)!);
    }

    // Set a new timeout to auto-clear typing status after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      socket.to(data.projectId).emit("user-stopped-typing", {
        projectId: data.projectId,
        userId: data.userId,
        userName: data.userName,
      });
      typingTimeouts.delete(timeoutKey);
    }, 3000);

    typingTimeouts.set(timeoutKey, timeout);
  });

  // Handle explicit stop-typing event
  socket.on("stop-typing", (data: { projectId: string; userId: string; userName: string }) => {
    console.log(`User ${data.userName} stopped typing in project ${data.projectId}`);
    
    // Clear timeout if exists
    const timeoutKey = `${data.projectId}:${data.userId}`;
    if (typingTimeouts.has(timeoutKey)) {
      clearTimeout(typingTimeouts.get(timeoutKey)!);
      typingTimeouts.delete(timeoutKey);
    }

    // Broadcast stop-typing event
    socket.to(data.projectId).emit("user-stopped-typing", data);
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    // Clear all timeouts for this socket
    typingTimeouts.forEach((timeout, key) => {
      clearTimeout(timeout);
    });
  });
};