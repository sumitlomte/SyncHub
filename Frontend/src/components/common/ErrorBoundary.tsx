import React, { type ReactNode } from "react";
import { logger } from "../../utils/logger";
import { toastManager } from "../../utils/toast";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component - Catches React component errors
 * Prevents entire app from crashing due to single component error
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    logger.error(
      `React Error Boundary caught an error: ${error.toString()}`,
      error,
      {
        componentStack: errorInfo.componentStack,
      }
    );

    // Update state with error details
    this.setState({
      errorInfo,
    });

    // Show notification to user
    toastManager.error("Something went wrong. Please try refreshing the page.");
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #fee2e2",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#dc2626",
                  margin: "0 0 0.5rem 0",
                }}
              >
                ⚠️ Oops! Something went wrong
              </h1>
              <p style={{ color: "#6b7280", margin: 0, marginBottom: "1rem" }}>
                We encountered an unexpected error. Please try refreshing the page or
                contact support if the problem persists.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 500, marginBottom: "0.5rem" }}>
                  Error Details (Dev Only)
                </summary>
                <pre
                  style={{
                    margin: "0.5rem 0 0 0",
                    overflow: "auto",
                    fontSize: "0.75rem",
                    padding: "0.5rem",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    color: "#374151",
                  }}
                >
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Go Home
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
