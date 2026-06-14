import api from "./axios";
import type { ServerMessage } from "../utils/message";

/**
 * Fetch all messages for a specific project
 */
export const fetchProjectMessages = async (projectId: string): Promise<ServerMessage[]> => {
  const response = await api.get(`/messages/${projectId}/messagesForProject`);
  return response.data;
};

/**
 * Save a new message to the project
 */
export const saveMessage = async (data: {
  content: string;
  projectId: string;
  userId: string;
}): Promise<ServerMessage> => {
  const response = await api.post(`/messages`, data);
  return response.data;
};
