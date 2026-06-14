import { useState, useRef, useEffect } from "react"
import { Button, Avatar, CircularProgress, IconButton, Tooltip } from "@mui/material"
import { Send, Smile, Paperclip } from "lucide-react"
import { userStore } from "../store/Auth-store"
import getSocket from "../Socket"
import { useParams } from "@tanstack/react-router"
import { toastManager } from "../utils/toast"
import { logger } from "../utils/logger"
import { type Message, type ServerMessage, normalizeMessage } from "../utils/message"
import useMessage from "../hook/use-message"
import { SocketEvents } from "../constants/socket-events"

interface TypingUser {
  userId: string
  userName: string
}

export default function ProjectConversation() {
  const [socketMessages, setSocketMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentProjectIdRef = useRef<string | undefined>(undefined)
  const { user } = userStore.get()
  const { projectId } = useParams({ strict: false })
  
  // Fetch messages from API
  const { messages: fetchedMessages, isLoadingMessages, messageError } = useMessage(projectId as string)
  
  // Combine API messages with Socket.IO real-time messages
  const allMessages = [...(fetchedMessages || []), ...socketMessages]

  // Update ref without triggering re-renders
  useEffect(() => {
    currentProjectIdRef.current = projectId
  }, [projectId])

  useEffect(() => {
    const socket = getSocket()
    socket.on(SocketEvents.MESSAGE_FROM_SERVER, (message: ServerMessage) => {
      try {
        // Only add messages for the current project
        if (message.projectId !== currentProjectIdRef.current) return

        const normalizedMessage = normalizeMessage(message)
        setSocketMessages((prevMessages) => {
          // Deduplicate by checking if a message with same content, userId, and recent timestamp exists
          const isDuplicate = prevMessages.some((m) => {
            const messageTime = typeof normalizedMessage.timestamp === 'string' 
              ? new Date(normalizedMessage.timestamp).getTime()
              : normalizedMessage.timestamp instanceof Date
                ? normalizedMessage.timestamp.getTime()
                : 0
            
            const prevMessageTime = typeof m.timestamp === 'string'
              ? new Date(m.timestamp).getTime()
              : m.timestamp instanceof Date
                ? m.timestamp.getTime()
                : 0
            
            // Match by userId + content + timestamp within 1 second (for optimistic updates)
            return (
              m.userId === normalizedMessage.userId &&
              m.content === normalizedMessage.content &&
              Math.abs(messageTime - prevMessageTime) < 1000
            )
          })
          
          return isDuplicate ? prevMessages : [...prevMessages, normalizedMessage]
        })
      } catch (err) {
        logger.error("Failed to add message", err as Error, { message })
      }
    })

    socket.on(SocketEvents.MESSAGE_ERROR, (data: { error: string }) => {
      logger.warn("Message save failed", { error: data.error })
      toastManager.show("error", "Failed to send message. Please try again.")
      setSending(false)
    })

    socket.on(SocketEvents.USER_TYPING, (data: { projectId: string; userId: string; userName: string }) => {
      try {
        setTypingUsers((prevTyping) => {
          const exists = prevTyping.some((u) => u.userId === data.userId)
          if (exists) return prevTyping
          
          return [...prevTyping, { userId: data.userId, userName: data.userName }]
        })
      } catch (error) {
        logger.warn("Failed to update typing users", { error: String(error) })
      }
    })

    socket.on(SocketEvents.USER_STOPPED_TYPING, (data: { projectId: string; userId: string; userName: string }) => {
      try {
        setTypingUsers((prevTyping) => prevTyping.filter((u) => u.userId !== data.userId))
      } catch (error) {
        logger.warn("Failed to remove typing user", { error: String(error) })
      }
    })

    socket.on(SocketEvents.CONNECT_ERROR, (error: { message: string }) => {
      logger.error("Socket connection error", new Error(error.message))
      toastManager.show("error", "Connection failed. Trying to reconnect...")
    })

    socket.on(SocketEvents.DISCONNECT, (reason: string) => {
      if (reason !== "io client namespace disconnect") {
        logger.warn("Socket disconnected", { reason })
        toastManager.show("warning", "Connection lost. Reconnecting...")
      }
    })

    return () => {
      socket.off(SocketEvents.MESSAGE_FROM_SERVER)
      socket.off(SocketEvents.MESSAGE_ERROR)
      socket.off(SocketEvents.USER_TYPING)
      socket.off(SocketEvents.USER_STOPPED_TYPING)
      socket.off(SocketEvents.CONNECT_ERROR)
      socket.off(SocketEvents.DISCONNECT)
    }
  }, [])

  // Join/leave the project room when the active project changes
  useEffect(() => {
    if (!projectId) return
    
    const socket = getSocket()
    socket.emit(SocketEvents.JOIN_PROJECT, projectId, user?.id)
    
    return () => {
      // Clean up: reset messages when leaving the project
      setSocketMessages([])
      socket.emit(SocketEvents.LEAVE_PROJECT, projectId, user?.id)
    }
  }, [projectId, user?.id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [allMessages.length]) // Only depend on length to avoid excessive scrolling

  const handleSendMessage = () => {
    if (!inputValue.trim() || !user?.id || !projectId) {
      if (!user?.id) {
        toastManager.show("error", "User information is missing. Please refresh the page.")
        logger.warn("Send message failed: missing user data")
      }
      if (!projectId) {
        toastManager.show("error", "Project information is missing. Please navigate back and try again.")
        logger.warn("Send message failed: missing projectId")
      }
      return
    }

    try {
      setSending(true)

      const newMessage: Message = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name || "You",
        content: inputValue,
        timestamp: new Date(),
      }

      // Optimistically add to UI
      setSocketMessages((prev) => [...prev, newMessage])
      setInputValue("")

      // Emit to server
      const socket = getSocket()
      const messagePayload = { ...newMessage, projectId }
      
      socket.emit(SocketEvents.SEND_MESSAGE, messagePayload, (ackError?: string) => {
        setSending(false)
        if (ackError) {
          logger.error("Message acknowledgement error", new Error(ackError), { ackError })
          toastManager.show("error", "Failed to send message. Please try again.")
        } else {
          logger.info("Message sent successfully")
        }
      })

      // Emit stop-typing when message is sent
      socket.emit(SocketEvents.STOP_TYPING, { projectId, userId: user.id, userName: user.name })
    } catch (error) {
      setSending(false)
      logger.error("Error sending message", error as Error, {
        projectId,
        userId: user?.id,
      })
      toastManager.show("error", "Failed to send message. Please try again.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = () => {
    if (!user?.id || !projectId) return

    // Throttle typing events - only emit once every 500ms
    if (typingThrottleRef.current) {
      return
    }

    try {
      const socket = getSocket()
      socket.emit(SocketEvents.TYPING, { userId: user.id, projectId, userName: user.name })

      typingThrottleRef.current = setTimeout(() => {
        typingThrottleRef.current = null
      }, 500)
    } catch (error) {
      logger.warn("Failed to emit typing event", { error: String(error) })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <CircularProgress />
          </div>
        ) : messageError ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-sm">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Failed to load messages</h3>
              <p className="text-gray-500 text-sm mb-4">{messageError}</p>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">No messages yet</h3>
              <p className="text-gray-500 text-sm">Start the conversation! Share updates, ask questions, or say hello to your team.</p>
            </div>
          </div>
        ) : (
          allMessages.map((message, index) => {
            const isOwn = message.userId === user?.id
            const isConsecutive = 
              index > 0 && allMessages[index - 1].userId === message.userId

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"} ${
                  isConsecutive ? "mt-1.5" : "mt-6"
                }`}
              >
                {!isOwn && !isConsecutive && (
                  <Avatar
                    alt={message.userName}
                    src={message.userAvatar}
                    className="flex-shrink-0 shadow-sm border border-white"
                    sx={{ width: 36, height: 36 }}
                  />
                )}
                {!isOwn && isConsecutive && (
                  <div className="w-[36px] flex-shrink-0" />
                )}

                <div className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                  {!isConsecutive && (
                    <div className={`flex items-baseline gap-2 mb-1.5 ${isOwn ? "justify-end" : "justify-start"}`}>
                      <p className="text-sm font-semibold text-gray-700">
                        {isOwn ? "You" : message.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(() => {
                          try {
                            const date = typeof message.timestamp === 'string' 
                              ? new Date(message.timestamp)
                              : message.timestamp
                            
                            if (isNaN(date.getTime())) {
                              return "Invalid time"
                            }
                            
                            return date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          } catch (error) {
                            logger.warn("Failed to format timestamp", { timestamp: message.timestamp, error: String(error) })
                            return "Invalid time"
                          }
                        })()}
                      </p>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl break-words whitespace-pre-wrap text-sm shadow-sm leading-relaxed ${
                      isOwn
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>

                {isOwn && !isConsecutive && (
                  <Avatar
                    alt={message.userName}
                    src={message.userAvatar}
                    className="flex-shrink-0 shadow-sm border border-white"
                    sx={{ width: 36, height: 36 }}
                  />
                )}
                {isOwn && isConsecutive && (
                  <div className="w-[36px] flex-shrink-0" />
                )}
              </div>
            )
          })
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
            <span className="font-medium">
              {typingUsers.length === 1
                ? `${typingUsers[0].userName} is typing...`
                : `${typingUsers.map((u) => u.userName).join(", ")} are typing...`}
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 sm:p-5 shrink-0 z-10 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-end overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
            
            {/* Left Action Buttons */}
            <div className="p-2 flex gap-1 text-gray-400">
              <Tooltip title="Add emoji">
                <IconButton size="small" className="!text-gray-400 hover:!text-gray-600"><Smile size={20} /></IconButton>
              </Tooltip>
              <Tooltip title="Attach file">
                <IconButton size="small" className="!text-gray-400 hover:!text-gray-600"><Paperclip size={20} /></IconButton>
              </Tooltip>
            </div>

            {/* Text Input */}
            <textarea
              value={inputValue}
              onChange={(e) => {setInputValue(e.target.value); handleTyping();}}
              onKeyPress={handleKeyPress}
              placeholder="Reply to the conversation..."
              className="flex-1 max-h-32 py-3 px-2 bg-transparent focus:outline-none resize-none text-sm text-gray-800 placeholder-gray-400"
              rows={1}
            />

            {/* Right Send Button */}
            <div className="p-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending}
                sx={{
                  minWidth: 0,
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  padding: 0,
                }}
              >
                {sending ? (
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                ) : (
                  <Send size={16} className={inputValue.trim() ? "ml-0.5" : ""} />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2 px-2">
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              💡 Press <strong className="text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">Shift + Enter</strong> for a new line
            </p>
            <p className="text-[10px] text-gray-300 font-medium tracking-wide uppercase">
              {inputValue.length} chars
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
