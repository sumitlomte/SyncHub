import { useState, useRef, useEffect } from "react";
import {
  Button,
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Send,
  MessageCircle,
  Paperclip,
  FileText,
  Download,
  UsersRound,
} from "lucide-react";
import { userStore } from "../store/Auth-store";
import getSocket from "../Socket";
import { useParams } from "@tanstack/react-router";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";
import {
  type Message,
  type ServerMessage,
  normalizeMessage,
} from "../utils/message";
import useMessage from "../hook/use-message";
import useDocument from "../hook/use-document";
import { SocketEvents } from "../constants/socket-events";
import { Skeleton, AvatarSkeleton } from "./ui/Skeleton";

interface TypingUser {
  userId: string;
  userName: string;
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ProjectConversation() {
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentProjectIdRef = useRef<string | undefined>(undefined);
  const { user } = userStore.get();
  const { projectId } = useParams({ strict: false });

  // Fetch messages from API
  const {
    messages: fetchedMessages,
    isLoadingMessages,
    messageError,
  } = useMessage(projectId as string);
  const { uploadDocumentMutation, getDownloadUrlMutation } = useDocument(
    projectId ?? "",
    user?.id ?? "",
  );

  // Combine API messages with Socket.IO real-time messages
  const allMessages = Array.from(
    new Map(
      [...(fetchedMessages || []), ...socketMessages].map((message) => [
        message.id,
        message,
      ]),
    ).values(),
  );

  // Update ref without triggering re-renders
  useEffect(() => {
    currentProjectIdRef.current = projectId;
  }, [projectId]);

  useEffect(() => {
    const socket = getSocket();
    socket.on(SocketEvents.MESSAGE_FROM_SERVER, (message: ServerMessage) => {
      try {
        // Only add messages for the current project
        if (message.projectId !== currentProjectIdRef.current) return;

        const normalizedMessage = normalizeMessage(message);
        setSocketMessages((prevMessages) => {
          // Deduplicate by checking if a message with same content, userId, and recent timestamp exists
          const isDuplicate = prevMessages.some((m) => {
            const messageTime =
              typeof normalizedMessage.timestamp === "string"
                ? new Date(normalizedMessage.timestamp).getTime()
                : normalizedMessage.timestamp instanceof Date
                  ? normalizedMessage.timestamp.getTime()
                  : 0;

            const prevMessageTime =
              typeof m.timestamp === "string"
                ? new Date(m.timestamp).getTime()
                : m.timestamp instanceof Date
                  ? m.timestamp.getTime()
                  : 0;

            // Match by userId + content + timestamp within 1 second (for optimistic updates)
            return (
              m.id === normalizedMessage.id ||
              (m.userId === normalizedMessage.userId &&
                m.type === normalizedMessage.type &&
                m.content === normalizedMessage.content &&
                Math.abs(messageTime - prevMessageTime) < 1000)
            );
          });

          return isDuplicate
            ? prevMessages
            : [...prevMessages, normalizedMessage];
        });
      } catch (err) {
        logger.error("Failed to add message", err as Error, { message });
      }
    });

    socket.on(SocketEvents.MESSAGE_ERROR, (data: { error: string }) => {
      logger.warn("Message save failed", { error: data.error });
      toastManager.show("error", "Failed to send message. Please try again.");
      setSending(false);
    });

    socket.on(
      SocketEvents.USER_TYPING,
      (data: { projectId: string; userId: string; userName: string }) => {
        try {
          setTypingUsers((prevTyping) => {
            const exists = prevTyping.some((u) => u.userId === data.userId);
            if (exists) return prevTyping;

            return [
              ...prevTyping,
              { userId: data.userId, userName: data.userName },
            ];
          });
        } catch (error) {
          logger.warn("Failed to update typing users", {
            error: String(error),
          });
        }
      },
    );

    socket.on(
      SocketEvents.USER_STOPPED_TYPING,
      (data: { projectId: string; userId: string; userName: string }) => {
        try {
          setTypingUsers((prevTyping) =>
            prevTyping.filter((u) => u.userId !== data.userId),
          );
        } catch (error) {
          logger.warn("Failed to remove typing user", { error: String(error) });
        }
      },
    );

    socket.on(SocketEvents.CONNECT_ERROR, (error: { message: string }) => {
      logger.error("Socket connection error", new Error(error.message));
      toastManager.show("error", "Connection failed. Trying to reconnect...");
    });

    socket.on(SocketEvents.DISCONNECT, (reason: string) => {
      if (reason !== "io client namespace disconnect") {
        logger.warn("Socket disconnected", { reason });
        toastManager.show("warning", "Connection lost. Reconnecting...");
      }
    });

    return () => {
      socket.off(SocketEvents.MESSAGE_FROM_SERVER);
      socket.off(SocketEvents.MESSAGE_ERROR);
      socket.off(SocketEvents.USER_TYPING);
      socket.off(SocketEvents.USER_STOPPED_TYPING);
      socket.off(SocketEvents.CONNECT_ERROR);
      socket.off(SocketEvents.DISCONNECT);
    };
  }, []);

  // Join/leave the project room when the active project changes
  useEffect(() => {
    if (!projectId) return;

    const socket = getSocket();
    socket.emit(SocketEvents.JOIN_PROJECT, projectId, user?.id);

    return () => {
      // Clean up: reset messages when leaving the project
      setSocketMessages([]);
      socket.emit(SocketEvents.LEAVE_PROJECT, projectId, user?.id);
    };
  }, [projectId, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages.length]); // Only depend on length to avoid excessive scrolling

  const handleSendMessage = () => {
    if (!inputValue.trim() || !user?.id || !projectId) {
      if (!user?.id) {
        toastManager.show(
          "error",
          "User information is missing. Please refresh the page.",
        );
        logger.warn("Send message failed: missing user data");
      }
      if (!projectId) {
        toastManager.show(
          "error",
          "Project information is missing. Please navigate back and try again.",
        );
        logger.warn("Send message failed: missing projectId");
      }
      return;
    }

    try {
      setSending(true);

      const newMessage: Message = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name || "You",
        content: inputValue,
        type: "TEXT",
        timestamp: new Date(),
      };

      // Optimistically add to UI
      setSocketMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // Emit to server
      const socket = getSocket();
      const messagePayload = { ...newMessage, projectId };

      socket.emit(
        SocketEvents.SEND_MESSAGE,
        messagePayload,
        (ackError?: string) => {
          setSending(false);
          if (ackError) {
            logger.error("Message acknowledgement error", new Error(ackError), {
              ackError,
            });
            toastManager.show(
              "error",
              "Failed to send message. Please try again.",
            );
          } else {
            logger.info("Message sent successfully");
          }
        },
      );

      // Emit stop-typing when message is sent
      socket.emit(SocketEvents.STOP_TYPING, {
        projectId,
        userId: user.id,
        userName: user.name,
      });
    } catch (error) {
      setSending(false);
      logger.error("Error sending message", error as Error, {
        projectId,
        userId: user?.id,
      });
      toastManager.show("error", "Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!user?.id || !projectId) return;

    // Throttle typing events - only emit once every 500ms
    if (typingThrottleRef.current) {
      return;
    }

    try {
      const socket = getSocket();
      socket.emit(SocketEvents.TYPING, {
        userId: user.id,
        projectId,
        userName: user.name,
      });

      typingThrottleRef.current = setTimeout(() => {
        typingThrottleRef.current = null;
      }, 500);
    } catch (error) {
      logger.warn("Failed to emit typing event", { error: String(error) });
    }
  };

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!user?.id || !projectId) {
      toastManager.show("error", "Unable to upload a file right now.");
      return;
    }

    try {
      await uploadDocumentMutation.mutateAsync(file);
    } catch (error) {
      logger.error(
        "Failed to upload conversation attachment",
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  };

  const handleDownloadDocument = async (documentId: string) => {
    try {
      const { downloadUrl } = await getDownloadUrlMutation.mutateAsync({
        documentId,
      });
      window.location.assign(downloadUrl);
    } catch (error) {
      logger.error(
        "Failed to download conversation attachment",
        error instanceof Error ? error : new Error(String(error)),
        { documentId },
      );
    }
  };

  return (
    <div className="app-conversation flex h-full min-h-0 flex-col">
      <header className="app-conversation-header flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="app-conversation-header__icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <MessageCircle size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold sm:text-base">
              Team conversation
            </h2>
            <p className="app-conversation-header__subtitle flex items-center gap-1.5 text-xs">
              <UsersRound size={13} aria-hidden="true" />
              Shared with project members
            </p>
          </div>
        </div>
        <span className="app-conversation-count shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
          {allMessages.length}{" "}
          {allMessages.length === 1 ? "message" : "messages"}
        </span>
      </header>

      {/* Messages Container */}
      <div
        className="app-conversation-messages min-h-0 flex-1 space-y-3 overflow-y-auto px-2 py-3 sm:space-y-4 sm:px-4 sm:py-4"
        role="log"
        aria-label="Project conversation messages"
        aria-live="polite"
      >
        {isLoadingMessages ? (
          <div className="app-conversation-loading space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex gap-3 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                {i % 2 === 0 && <AvatarSkeleton size={40} />}
                <div
                  className={`${i % 2 === 0 ? "max-w-xs" : "max-w-xs"} space-y-2`}
                >
                  <Skeleton height={16} width={i % 2 === 0 ? "60%" : "100%"} />
                  <div className="app-conversation-skeleton-bubble space-y-2 rounded-xl p-3">
                    <Skeleton height={14} width="100%" />
                    <Skeleton
                      height={14}
                      width={i % 3 === 0 ? "80%" : "100%"}
                    />
                  </div>
                  <Skeleton height={12} width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : messageError ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="app-conversation-empty max-w-sm rounded-xl p-4 sm:p-5">
              <div className="app-conversation-empty__icon app-conversation-empty__icon--error mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full">
                <MessageCircle size={24} aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">
                Failed to load messages
              </h3>
              <p className="app-conversation-description mb-4 text-sm">
                {messageError}
              </p>
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
            <div className="app-conversation-empty max-w-sm rounded-xl p-4 sm:p-5">
              <div className="app-conversation-empty__icon mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full">
                <MessageCircle size={24} aria-hidden="true" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">No messages yet</h3>
              <p className="app-conversation-description text-sm">
                Start the conversation! Share updates, ask questions, or say
                hello to your team.
              </p>
            </div>
          </div>
        ) : (
          allMessages.map((message, index) => {
            const isOwn = message.userId === user?.id;
            const document = message.document;
            const isConsecutive =
              index > 0 && allMessages[index - 1].userId === message.userId;

            return (
              <div
                key={message.id}
                className={`app-conversation-message flex gap-2 sm:gap-3 ${isOwn ? "is-own justify-end" : "justify-start"} ${
                  isConsecutive ? "mt-0.5" : "mt-3"
                }`}
              >
                {!isOwn && !isConsecutive && (
                  <Avatar
                    alt={message.userName}
                    src={message.userAvatar}
                    className="app-conversation-avatar !h-9 !w-9 flex-shrink-0"
                  />
                )}
                {!isOwn && isConsecutive && (
                  <div className="hidden w-[36px] flex-shrink-0 sm:block" />
                )}

                <div
                  className={`app-conversation-message__content flex max-w-[88%] flex-col sm:max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}
                >
                  {!isConsecutive && (
                    <div
                      className={`app-conversation-message__meta mb-1 flex items-baseline gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <p className="text-sm font-semibold">
                        {isOwn ? "You" : message.userName}
                      </p>
                      <p className="text-xs">
                        {(() => {
                          try {
                            const date =
                              typeof message.timestamp === "string"
                                ? new Date(message.timestamp)
                                : message.timestamp;

                            if (isNaN(date.getTime())) {
                              return "Invalid time";
                            }

                            return date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          } catch (error) {
                            logger.warn("Failed to format timestamp", {
                              timestamp: message.timestamp,
                              error: String(error),
                            });
                            return "Invalid time";
                          }
                        })()}
                      </p>
                    </div>
                  )}
                  {message.type === "DOCUMENT" && document ? (
                    <div
                      className={`app-conversation-attachment flex max-w-full items-center gap-2 rounded-xl p-2 text-sm ${
                        isOwn ? "is-own rounded-tr-sm" : "rounded-tl-sm"
                      }`}
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-black/10">
                        <FileText size={18} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate font-medium"
                          title={document.fileName}
                        >
                          {document.fileName}
                        </p>
                        <p className="app-conversation-attachment__size text-xs">
                          {formatFileSize(document.fileSize)}
                        </p>
                      </div>
                      <Tooltip title="Download file">
                        <span>
                          <IconButton
                            size="small"
                            aria-label={`Download ${document.fileName}`}
                            disabled={getDownloadUrlMutation.isPending}
                            onClick={() => handleDownloadDocument(document.id)}
                            className={`app-conversation-attachment__download ${isOwn ? "is-own" : ""}`}
                          >
                            {getDownloadUrlMutation.isPending ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <Download size={18} />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    <div
                      className={`app-conversation-bubble rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        isOwn ? "is-own rounded-tr-sm" : "rounded-tl-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div
            className="app-conversation-typing flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm"
            role="status"
          >
            <span className="font-medium">
              {typingUsers.length === 1
                ? `${typingUsers[0].userName} is typing`
                : `${typingUsers.map((u) => u.userName).join(", ")} are typing`}
            </span>
            <div className="flex gap-1" aria-hidden="true">
              <span className="typing-dot h-2 w-2 rounded-full bg-gray-400"></span>
              <span className="typing-dot typing-dot--delayed h-2 w-2 rounded-full bg-gray-400"></span>
              <span className="typing-dot typing-dot--more-delayed h-2 w-2 rounded-full bg-gray-400"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="app-conversation-footer relative z-10 shrink-0 border-t px-2 py-2 sm:px-4 sm:py-3">
        <div className="max-w-4xl mx-auto">
          <div className="app-conversation-composer flex items-end overflow-hidden rounded-2xl transition-all shadow-sm">
            {/* Left Action Buttons */}
            <div className="flex gap-1 p-1">
              <Tooltip title="Attach file">
                <IconButton
                  size="small"
                  aria-label="Attach file"
                  disabled={uploadDocumentMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="app-icon-button"
                >
                  {uploadDocumentMutation.isPending ? (
                    <CircularProgress size={18} />
                  ) : (
                    <Paperclip size={20} />
                  )}
                </IconButton>
              </Tooltip>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelection}
              aria-label="Choose a file to attach"
            />

            {/* Text Input */}
            <textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Reply to the conversation..."
              aria-label="Write a message"
              className="app-conversation-composer__input flex-1 max-h-32 px-2 py-2 bg-transparent resize-none text-sm"
              rows={1}
            />

            {/* Right Send Button */}
            <div className="p-1">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sending}
                aria-label={sending ? "Sending message" : "Send message"}
                className="app-conversation-send"
              >
                {sending ? (
                  <CircularProgress
                    size={16}
                    className="app-on-primary-progress"
                  />
                ) : (
                  <Send
                    size={16}
                    className={inputValue.trim() ? "ml-0.5" : ""}
                  />
                )}
              </Button>
            </div>
          </div>

          <div className="app-conversation-hint mt-1 flex items-center justify-between gap-2 px-1">
            <p className="flex items-center gap-1 text-[11px]">
              <strong className="rounded border px-1 py-0.5">
                Shift + Enter
              </strong>{" "}
              <span>for a new line</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
