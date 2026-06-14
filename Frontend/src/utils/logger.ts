/**
 * Centralized error logging service
 * Logs errors to console in development and sends to logging service in production
 */

// Type definition for Sentry on window
interface WindowWithSentry extends Window {
  Sentry?: {
    captureException: (error: Error, context?: Record<string, unknown>) => void;
  };
}

// Production logging configuration
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";
const API_LOGGING_ENDPOINT = import.meta.env.VITE_API_LOGGING_ENDPOINT || "";

export const LogLevel = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  log(level: LogLevel, message: string, error?: Error, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context,
    };

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const logStyle = this.getLogStyle(level);
      if (error) {          
        console.error(`%c[${entry.timestamp}] [${entry.level}] ${entry.message}`, logStyle, { ...entry.context, error });
      }
    }

    // In production, send to logging service
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.sendToLoggingService(entry);
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, undefined, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, undefined, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, error, context);
  }

  private getLogStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: "color: #0ea5e9; font-weight: 500;",
      [LogLevel.INFO]: "color: #10b981; font-weight: 500;",
      [LogLevel.WARN]: "color: #f59e0b; font-weight: 600;",
      [LogLevel.ERROR]: "color: #ef4444; font-weight: 700;",
    };
    return styles[level] || "";
  }

  private sendToLoggingService(entry: LogEntry) {
    // Send to Sentry if configured
    if (SENTRY_DSN && typeof window !== "undefined") {
      this.sendToSentry(entry);
    }

    // Send to custom API endpoint if configured
    if (API_LOGGING_ENDPOINT) {
      this.sendToApiEndpoint(entry);
    }

    // Fallback: Log to console in development-like environment
    if (!SENTRY_DSN && !API_LOGGING_ENDPOINT) {
      console.error("Production error logged:", entry);
    }
  }

  private sendToSentry(entry: LogEntry) {
    try {
      // Check if Sentry SDK is loaded
      const windowWithSentry = window as WindowWithSentry;
      if (windowWithSentry.Sentry) {
        const sentryLevel = (
          {
            [LogLevel.ERROR]: "error",
            [LogLevel.WARN]: "warning",
            [LogLevel.INFO]: "info",
            [LogLevel.DEBUG]: "debug",
          } as Record<LogLevel, string>
        )[entry.level];

        windowWithSentry.Sentry.captureException(entry.error || new Error(entry.message), {
          level: sentryLevel,
          tags: { context: "error-logger" },
          extra: { context: entry.context },
        });
      }
    } catch (error) {
      // Silently fail - don't crash the app if Sentry fails
      console.error("Failed to send error to Sentry", error);
    }
  }

  private sendToApiEndpoint(entry: LogEntry) {
    try {
      // Send to custom logging endpoint
      const payload = {
        timestamp: entry.timestamp,
        level: entry.level,
        message: entry.message,
        error: entry.error ? {
          name: entry.error.name,
          message: entry.error.message,
          stack: entry.error.stack,
        } : null,
        context: entry.context,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Use navigator.sendBeacon for reliability (won't block page navigation)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API_LOGGING_ENDPOINT, JSON.stringify(payload));
      } else {
        // Fallback to fetch
        fetch(API_LOGGING_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true, // Keep connection alive even if page unloads
        }).catch((error) => {
          // Silently fail - don't crash the app
          console.error("Failed to send error to logging endpoint", error);
        });
      }
    } catch (error) {
      // Silently fail - don't crash the app if logging fails
      console.error("Failed to send error to API endpoint", error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
