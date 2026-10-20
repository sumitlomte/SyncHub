import type { Server } from "socket.io";

let io: Server | undefined;

export const setIO = (server: Server) => {
  io = server;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
