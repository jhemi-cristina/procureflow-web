import { use } from "react";
import { RequestDialogsContext } from "@/contexts/request-dialogs-context";

export function useRequestDialogs() {
  const context = use(RequestDialogsContext);
  if (!context) {
    throw new Error("useRequestDialogs deve ser usado dentro de <RequestDialogsProvider>.");
  }
  return context;
}
