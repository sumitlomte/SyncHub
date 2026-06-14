import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjectMessages, saveMessage } from "../api/message-api";
import type { ServerMessage, Message } from "../utils/message";
import { normalizeMessage } from "../utils/message";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";

interface SaveMessageData {
  content: string;
  projectId: string;
  userId: string;
}

/**
 * Hook for managing project messages
 * Handles fetching messages and saving new messages
 */
export default function useMessage(projectId?: string) {
  const queryClient = useQueryClient();

  /**
   * Fetch all messages for a project
   */
  const fetchMessages = useQuery<ServerMessage[], Error, Message[]>({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      try {
        logger.info("Fetching messages for project", { projectId });
        const data = await fetchProjectMessages(projectId as string);
        logger.info("Messages fetched successfully", { count: data?.length || 0 });
        return data;
      } catch (error) {
        logger.error("Failed to fetch messages", error as Error, { projectId });
        throw error;
      }
    },
    select: (data: ServerMessage[]) => {
      // Normalize messages on the client side
      return data.map((msg) => normalizeMessage(msg));
    },
    enabled: !!projectId, // Only fetch if projectId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Save a new message
   */
  const saveMutation = useMutation<ServerMessage, Error, SaveMessageData>({
    mutationFn: saveMessage,
    onSuccess: (newMessage) => {
      // Update the query cache with the new message
      queryClient.setQueryData(
        ["messages", projectId],
        (oldData: ServerMessage[] | undefined) => {
          if (!oldData) return [newMessage];
          return [...oldData, newMessage];
        }
      );
      logger.info("Message saved successfully");
    },
    onError: (error) => {
      logger.error("Failed to save message", error);
      toastManager.show("error", "Failed to save message. Please try again.");
    },
  });

  return {
    messages: fetchMessages.data || [],
    isLoadingMessages: fetchMessages.isLoading,
    isErrorMessages: fetchMessages.isError,
    errorMessages: fetchMessages.error,
    refetchMessages: fetchMessages.refetch,
    saveMessage: saveMutation.mutate,
    isSavingMessage: saveMutation.isPending,
    messageError: fetchMessages.error?.message || null,
  };
}
