import { io, Socket as SocketType } from "socket.io-client";
import { getUserFromLocalStorage } from "./store/Auth-store";

let socket: SocketType | undefined;

/**
 * Initialize socket connection with user authentication
 * Called on app load and after login
 */
export function initializeSocket() {
  const user = getUserFromLocalStorage();
  
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      autoConnect: false,
      // Pass user ID for server-side authentication
      auth: {
        userId: user?.id || null,
        userName: user?.name || null,
      },
    });

    // Connect after setup
    socket.connect();
  } else if (user?.id) {
    // If socket exists but user changed, update auth and reconnect
    socket.auth = {
      userId: user.id,
      userName: user.name,
    };
    
    // Disconnect and reconnect with new user credentials
    socket.disconnect();
    socket.connect();
  }
}

/**
 * Disconnect socket when user logs out
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
}

/**
 * Get socket instance - creates a lazy socket if needed
 */
function getSocket(): SocketType {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      autoConnect: false,
    });
  }
  return socket;
}

// Export socket instance for use in components
export default getSocket();
