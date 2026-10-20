import api from "./axios";
import type { Document } from "../types/document";

interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

interface DownloadUrlResponse {
  downloadUrl: string;
}

const getS3UploadError = async (response: Response) => {
  const responseBody = await response.text();
  const xml = new DOMParser().parseFromString(responseBody, "application/xml");
  const code = xml.querySelector("Code")?.textContent;
  const message = xml.querySelector("Message")?.textContent;

  if (code || message) {
    return `S3 upload failed (${code ?? response.status}): ${message ?? response.statusText}`;
  }

  return `S3 upload failed with status ${response.status}`;
};

export const getUploadUrl = async (projectId: string, userId: string, fileName: string, fileType: string): Promise<UploadUrlResponse> => {
  const response = await api.post(`/documents/${projectId}/${userId}/upload-url`, { fileName, fileType });
  return response.data;
}

export const confirmUpload = async (projectId: string, userId: string, fileName: string, fileKey: string, fileType: string, fileSize: number): Promise<Document> => {
  const response = await api.post(`/documents/${projectId}/${userId}/confirm`, { fileName, fileKey, fileType, fileSize });
  return response.data;
}

export const uploadDocument = async (projectId: string, userId: string, file: File): Promise<Document> => {
  const fileType = file.type || "application/octet-stream";
  const { uploadUrl, fileKey } = await getUploadUrl(projectId, userId, file.name, fileType);
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": fileType },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(await getS3UploadError(uploadResponse));
  }

  return confirmUpload(projectId, userId, file.name, fileKey, fileType, file.size);
}

export const listDocuments = async (projectId: string, userId: string): Promise<Document[]> => {
  const response = await api.get(`/documents/${projectId}/${userId}`);
  return response.data;
}

export const getDownloadUrl = async (documentId: string, userId: string): Promise<DownloadUrlResponse> => {
  const response = await api.get(`/documents/download/${documentId}/${userId}`);
  return response.data;
}

export const deleteDocument = async (documentId: string) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
}