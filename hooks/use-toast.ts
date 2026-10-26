import { use } from "react";
import { ToastContext } from "@/contexts/toast-context";

export function useToast() {
  const context = use(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>.");
  }
  return context;
}
