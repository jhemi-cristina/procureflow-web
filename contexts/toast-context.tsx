"use client";

import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import styles from "./toast.module.css";

type ToastTone = "success" | "error";

interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

export interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4500;
let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = ++nextId;
      setToasts((current) => [...current.slice(-2), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message),
    }),
    [push],
  );

  return (
    <ToastContext value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite">
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CircleCheck : CircleAlert;
          return (
            <div key={toast.id} className={`${styles.toast} ${styles[toast.tone]}`} role="status">
              <Icon size={18} className={styles.icon} />
              <p>{toast.message}</p>
              <button
                type="button"
                className={styles.close}
                aria-label="Fechar notificação"
                onClick={() => dismiss(toast.id)}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext>
  );
}
