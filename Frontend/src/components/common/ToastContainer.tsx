import { useEffect, useState } from "react";
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
    <div className="app-toast-viewport">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`app-toast app-toast--${toast.type}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span aria-hidden="true">{getIcon(toast.type)}</span>
          <span className="app-toast__message">{toast.message}</span>
          <button
            type="button"
            className="app-toast__close"
            onClick={() => toastManager.remove(toast.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
