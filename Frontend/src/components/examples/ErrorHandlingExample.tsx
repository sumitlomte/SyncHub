import { useErrorHandler } from "../../hook/use-error-handler";
import { logger } from "../../utils/logger";
import { toastManager } from "../../utils/toast";
import api from "../../api/axios";
import { useState } from "react";

/**
 * Example Component demonstrating proper error handling patterns
 */
export function ErrorHandlingExample() {
  const { handleError, handleSuccess, handleWarning, handleInfo } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  // Example 1: Using useErrorHandler hook
  const handleFetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/data");
      handleSuccess("Data loaded successfully!");
      logger.debug("Data fetched", { count: response.data.length });
    } catch (error) {
      handleError(error, "fetch-data");
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Direct toast usage
  const handleDirectToast = () => {
    toastManager.success("This is a success message");
    setTimeout(() => toastManager.info("Info message"), 500);
    setTimeout(() => toastManager.warning("Warning message"), 1000);
    setTimeout(() => toastManager.error("Error message", 5000), 1500);
  };

  // Example 3: Direct logger usage
  const handleLogging = () => {
    logger.debug("Debug level message");
    logger.info("Info level message");
    logger.warn("Warning level message");
    logger.error("Error level message", new Error("Test error"), {
      userId: 123,
      context: "example",
    });
    handleSuccess("Check console for logged messages!");
  };

  // Example 4: Validation with error handling
  const handleValidation = () => {
    const email = "invalid-email";
    
    if (!email.includes("@")) {
      handleWarning("Please enter a valid email address");
      return;
    }

    handleSuccess("Email is valid!");
  };

  // Example 5: Multiple operations
  const handleMultipleOperations = async () => {
    setLoading(true);
    try {
      handleInfo("Starting multiple operations...");

      // Operation 1
      logger.info("Operation 1 starting");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Operation 2
      logger.info("Operation 2 starting");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Operation 3
      logger.info("Operation 3 starting");
      await new Promise((resolve) => setTimeout(resolve, 500));

      handleSuccess("All operations completed successfully!");
    } catch (error) {
      handleError(error, "multiple-operations");
    } finally {
      setLoading(false);
    }
  };

  // Example 6: Simulated API error
  const handleSimulateApiError = async () => {
    try {
      // This will trigger the Axios interceptor error handling
      await api.get("/api/nonexistent");
    } catch (error) {
      // Error is already handled by Axios interceptor
      // But you can also handle it here
      logger.error("API call failed", error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Error Handling Examples</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>1. useErrorHandler Hook</h2>
        <button
          onClick={handleFetchData}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Fetch Data (with error handling)"}
        </button>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Demonstrates using the useErrorHandler hook for API calls
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>2. Direct Toast Usage</h2>
        <button
          onClick={handleDirectToast}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Show Multiple Toasts
        </button>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Shows success, info, warning, and error toasts
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>3. Logger Service</h2>
        <button
          onClick={handleLogging}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Log Messages (check console)
        </button>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Opens browser console to show logging at different levels
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>4. Validation Error Handling</h2>
        <button
          onClick={handleValidation}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Validate Email
        </button>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Shows warning toast for invalid email
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>5. Multiple Operations</h2>
        <button
          onClick={handleMultipleOperations}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#06b6d4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Processing..." : "Run Multiple Operations"}
        </button>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Demonstrates handling multiple async operations
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>6. Simulated API Error</h2>
        <button
          onClick={handleSimulateApiError}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Trigger API Error (404)
        </button>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Shows how Axios interceptor handles API errors
        </p>
      </section>

      <div
        style={{
          marginTop: "3rem",
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "4px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h3 style={{ marginTop: 0 }}>💡 Tip</h3>
        <p>
          Open your browser's Developer Tools (F12 → Console tab) to see the
          colored log messages. Each log level has a different color for easy
          identification.
        </p>
      </div>
    </div>
  );
}

export default ErrorHandlingExample;
