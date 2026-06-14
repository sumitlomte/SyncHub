/**
 * Toast notification system for better UX than alert() popups
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Store for toast notifications
let toastListeners: Array<(toast: Toast) => void> = [];
const toasts: Map<string, Toast> = new Map();

export const toastManager = {
  /**
   * Subscribe to toast updates
   */
  subscribe(callback: (toast: Toast) => void) {
    toastListeners.push(callback);
    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== callback);
    };
  },

  /**
   * Show a toast notification
   */
  show(type: ToastType, message: string, duration = 3000) {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, message, duration };

    toasts.set(id, toast);
    toastListeners.forEach((callback) => callback(toast));

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  },

  /**
   * Remove a toast notification
   */
  remove(id: string) {
    toasts.delete(id);
    // Notify listeners of removal
    toastListeners.forEach((callback) => callback({ id, type: "info", message: "" }));
  },

  /**
   * Show success toast
   */
  success(message: string, duration?: number) {
    return this.show("success", message, duration);
  },

  /**
   * Show error toast
   */
  error(message: string, duration?: number) {
    return this.show("error", message, duration ?? 5000); // Longer duration for errors
  },

  /**
   * Show info toast
   */
  info(message: string, duration?: number) {
    return this.show("info", message, duration);
  },

  /**
   * Show warning toast
   */
  warning(message: string, duration?: number) {
    return this.show("warning", message, duration);
  },

  /**
   * Get all active toasts
   */
  getAll(): Toast[] {
    return Array.from(toasts.values());
  },

  /**
   * Clear all toasts
   */
  clearAll() {
    toasts.clear();
  },
};
