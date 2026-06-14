export const SocketEvents = {
    // Built-in Socket.io events
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CONNECT_ERROR: "connect_error",

    // Server-to-client events
    MESSAGE_FROM_SERVER: "message-from-server",
    USER_TYPING: "user-typing",
    USER_STOPPED_TYPING: "user-stopped-typing",
    PROJECT_UPDATED: "project-updated",
    MESSAGE_ERROR: "message-error",

    // Client-to-server events
    JOIN_PROJECT: "join-project",
    LEAVE_PROJECT: "leave-project",
    SEND_MESSAGE: "send-message",
    TYPING: "typing",
    STOP_TYPING: "stop-typing",
} as const;

export type SocketEvent = typeof SocketEvents[keyof typeof SocketEvents];
