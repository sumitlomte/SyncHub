import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDocuments, uploadDocument, getDownloadUrl } from "../api/document-api";
import type { Document } from "../types/document";
import { toastManager } from "../utils/toast";
import { logger } from "../utils/logger";

export default function useDocument(projectId: string, userId: string) {
  const queryClient = useQueryClient();

  const fetchDocuments = useQuery<Document[], Error>({
    queryKey: ["documents", projectId, userId],
    queryFn: () => listDocuments(projectId, userId),
    enabled: Boolean(projectId && userId),
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(projectId, userId, file),
    onSuccess: async (document) => {
      logger.info("Document uploaded successfully", { documentId: document.id });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["documents", projectId, userId] }),
        queryClient.invalidateQueries({ queryKey: ["messages", projectId] }),
      ]);
    },
    onError: (error) => {
      logger.error("Failed to upload document", error);
      toastManager.error(error.message);
    },
  });

  const getDownloadUrlMutation = useMutation({
    mutationFn: ({ documentId }: { documentId: string }) => getDownloadUrl(documentId, userId),
    onError: (error) => {
      logger.error("Failed to fetch download URL", error);
      toastManager.error("Failed to download document");
    },
  });

  return {
    fetchDocuments,
    uploadDocumentMutation,
    getDownloadUrlMutation,
  };
}