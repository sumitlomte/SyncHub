import React, { useEffect, useState } from "react";
import { toastManager, type Toast, type ToastType } from "../../utils/toast";

/**
 * Toast Container Component - Displays toast notifications
 * Place this at the root level of your app
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      setToasts((prevToasts) => {
        // If it's a removal (empty message), filter it out
        if (!toast.message) {
          return prevToasts.filter((t) => t.id !== toast.id);
        }
        // Add new toast
        const existing = prevToasts.find((t) => t.id === toast.id);
        if (existing) {
          return prevToasts;
        }
        return [...prevToasts, toast];
      });
    });

    return unsubscribe;
  }, []);

  const getToastStyles = (type: ToastType) => {
    const baseStyles: React.CSSProperties = {
      padding: "1rem",
      borderRadius: "6px",
      marginBottom: "0.75rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontSize: "0.9rem",
      fontWeight: 500,
      animation: "slideIn 0.3s ease-in-out",
    };

    const typeStyles: Record<ToastType, React.CSSProperties> = {
      success: {
        backgroundColor: "#dcfce7",
        color: "#166534",
        borderLeft: "4px solid #22c55e",
      },
      error: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        borderLeft: "4px solid #ef4444",
      },
      info: {
        backgroundColor: "#dbeafe",
        color: "#0c4a6e",
        borderLeft: "4px solid #0ea5e9",
      },
      warning: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
        borderLeft: "4px solid #f59e0b",
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = (type: ToastType) => {
    const icons: Record<ToastType, string> = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠",
    };
    return icons[type];
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .toast-exit {
          animation: slideOut 0.3s ease-in-out;
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 9999,
          maxWidth: "400px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={getToastStyles(toast.type)}
            onClick={() => toastManager.remove(toast.id)}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span style={{ fontSize: "1.1rem" }}>{getIcon(toast.type)}</span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toastManager.remove(toast.id);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
