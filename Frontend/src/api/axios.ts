import axios from "axios";
import { logger } from "../utils/logger";
import { toastManager } from "../utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 5000,
});

/**
 * Setup global error and response interceptors for Axios
 * Handles common error scenarios and logs all API interactions
 */
export function setupAxiosInterceptors() {
  // Response Interceptor
  api.interceptors.response.use(
    (response) => {
      // Log successful API calls in development
      logger.debug(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
      });
      return response;
    },
    (error) => {
      // Handle response errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        // Log the error
        logger.error(
          `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
          error,
          {
            status,
            message: data?.message,
            endpoint: error.config?.url,
          }
        );

        // Handle specific status codes
        if (status === 401) {
          // Unauthorized - clear local storage and redirect to login
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else if (status === 500) {
          toastManager.error("Server error. Please try again later.");
        } else if (status === 422 || status === 400) {
          // Validation error - message will be handled by the component
        } else if (error.code === "ECONNABORTED") {
          toastManager.error("Request timeout. Please check your connection.");
        }
      } else {
        // Non-Axios errors (network errors, etc.)
        logger.error("Network error", error as Error, {
          message: (error)?.message,
        });
        toastManager.error("Network error. Please check your connection.");
      }

      return Promise.reject(error);
    }
  );

  // Request Interceptor (optional - for adding auth tokens, etc.)
  api.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          // If you have a token in localStorage, add it here
          // const user = JSON.parse(userStr);
          // config.headers.Authorization = `Bearer ${user.token}`;
        } catch (error) {
          logger.warn("Failed to parse user from localStorage", { error });
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default api;