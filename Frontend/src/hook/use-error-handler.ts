import { useCallback } from "react";
import { logger } from "../utils/logger";
import { toastManager } from "../utils/toast";
import axios from "axios";

/**
 * Custom hook for consistent error handling
 * Handles different error types and displays appropriate messages
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, context?: string) => {
    let errorMessage = "An unexpected error occurred. Please try again.";
    let errorDetails: Record<string, unknown> = {};

    if (axios.isAxiosError(error)) {
      // Handle Axios/API errors
      const status = error.response?.status;
      const data = error.response?.data;

      errorDetails = {
        status,
        message: data?.message || error.message,
        endpoint: error.config?.url,
      };

      if (status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (status === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (status === 422 || status === 400) {
        errorMessage = data?.message || "Please check your input and try again.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else {
        errorMessage = data?.message || error.message || errorMessage;
      }
    } else if (error instanceof Error) {
      // Handle JavaScript errors
      errorMessage = error.message || errorMessage;
      errorDetails = { name: error.name };
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Log the error
    logger.error(
      `Error${context ? ` in ${context}` : ""}: ${errorMessage}`,
      error instanceof Error ? error : new Error(String(error)),
      errorDetails
    );

    // Show user-friendly error message
    toastManager.error(errorMessage);

    return { message: errorMessage, details: errorDetails };
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toastManager.success(message);
    logger.info(`Success: ${message}`);
  }, []);

  const handleWarning = useCallback((message: string) => {
    toastManager.warning(message);
    logger.warn(`Warning: ${message}`);
  }, []);

  const handleInfo = useCallback((message: string) => {
    toastManager.info(message);
    logger.info(`Info: ${message}`);
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
  };
}
