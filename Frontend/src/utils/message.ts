
export interface ServerMessage {
  id: string
  userId: string
  content: string
  timestamp?: string
  createdAt?: string
  userAvatar?: string
  userName?: string
  user?: {
    id: string
    name: string
    email?: string
  }
  [key: string]: unknown
}

export interface Message {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: Date | string
  createdAt?: string
  user?: {
    id: string
    name: string
    email?: string
  }
}

export const normalizeMessage = (msg: ServerMessage): Message => {
  const timestamp = typeof msg.timestamp === 'string' 
    ? new Date(msg.timestamp) 
    : msg.createdAt 
      ? new Date(msg.createdAt)
      : new Date()

  return {
    id: msg.id,
    userId: msg.userId,
    userName: msg.user?.name || msg.userName || "Unknown User",
    userAvatar: msg.userAvatar,
    content: msg.content,
    timestamp,
  }
}
