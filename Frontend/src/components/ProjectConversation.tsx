import { useState, useRef, useEffect } from "react"
import { Button, Avatar, CircularProgress, IconButton, Tooltip } from "@mui/material"
import { Send, Smile, Paperclip } from "lucide-react"
import { userStore } from "../store/user-store"
import socket from "../Socket"
import { useParams } from "@tanstack/react-router"

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: Date
}

export default function ProjectConversation() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = userStore.get()
  const { projectId } = useParams({ strict: false })

  useEffect(() => {
    socket.on("message-from-server", (message: Message) => {
      setMessages((prevMessages) =>
        prevMessages.some((m) => m.id === message.id)
          ? prevMessages
          : [...prevMessages, message]
      )
    })

    return () => {
      socket.off("message-from-server")

    }
  }, [])

  // Join/leave the project room when the active project changes
  useEffect(() => {
    if (!projectId) return
    socket.emit("join-project", projectId, user?.id)
    return () => {
      socket.emit("leave-project", projectId, user?.id)
    }
  }, [projectId, user?.id])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: user?.id || "current_user",
      userName: user?.name || "You",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    socket.emit("project-message", { ...newMessage, projectId })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <CircularProgress />
          </div>
        ) : messages.length === 0 ? (
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
          messages.map((message, index) => {
            const isOwn = message.userId === user?.id
            const isConsecutive = 
              index > 0 && messages[index - 1].userId === message.userId

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
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
              onChange={(e) => setInputValue(e.target.value)}
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
                disabled={!inputValue.trim()}
                sx={{
                  minWidth: 0,
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  padding: 0,
                }}
              >
                <Send size={16} className={inputValue.trim() ? "ml-0.5" : ""} />
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
