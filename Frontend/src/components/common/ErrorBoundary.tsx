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
      },
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
        <main className="error-boundary-page">
          <section
            className="error-boundary-card"
            aria-labelledby="error-title"
          >
            <div>
              <h1 id="error-title" className="error-boundary-title">
                ⚠️ Oops! Something went wrong
              </h1>
              <p className="error-boundary-description">
                We encountered an unexpected error. Please try refreshing the
                page or contact support if the problem persists.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Dev Only)</summary>
                <pre>
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button type="button" onClick={() => window.location.assign("/")}>
                Go Home
              </button>
              <button type="button" onClick={this.handleReset}>
                Try Again
              </button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
