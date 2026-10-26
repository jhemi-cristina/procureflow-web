"use client";

import { createContext, useMemo, useState, type ReactNode } from "react";
import { DecisionDialog } from "@/components/purchase-requests/decision-dialog";
import { RequestDetailsDialog } from "@/components/purchase-requests/request-details-dialog";
import { RequestFormDialog } from "@/components/purchase-requests/request-form-dialog";
import type { PurchaseRequest, PurchaseRequestDecision } from "@/types/purchase-request";

type DialogState =
  | { type: "form"; request: PurchaseRequest | null }
  | { type: "details"; request: PurchaseRequest }
  | { type: "decision"; request: PurchaseRequest; decision: PurchaseRequestDecision }
  | null;

export interface RequestDialogsContextValue {
  openCreate: () => void;
  openEdit: (request: PurchaseRequest) => void;
  openDetails: (request: PurchaseRequest) => void;
  openDecision: (request: PurchaseRequest, decision: PurchaseRequestDecision) => void;
}

export const RequestDialogsContext = createContext<RequestDialogsContextValue | null>(null);

/**
 * Centraliza os diálogos de solicitações para que qualquer tela (dashboard, listagem)
 * possa abri-los sem duplicar estado. Cada diálogo só é montado enquanto está aberto.
 */
export function RequestDialogsProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>(null);
  const close = () => setDialog(null);

  const value = useMemo<RequestDialogsContextValue>(
    () => ({
      openCreate: () => setDialog({ type: "form", request: null }),
      openEdit: (request) => setDialog({ type: "form", request }),
      openDetails: (request) => setDialog({ type: "details", request }),
      openDecision: (request, decision) => setDialog({ type: "decision", request, decision }),
    }),
    [],
  );

  return (
    <RequestDialogsContext value={value}>
      {children}
      {dialog?.type === "form" && (
        <RequestFormDialog key={dialog.request?.id ?? "new"} request={dialog.request} onClose={close} />
      )}
      {dialog?.type === "details" && (
        <RequestDetailsDialog request={dialog.request} onClose={close} />
      )}
      {dialog?.type === "decision" && (
        <DecisionDialog request={dialog.request} decision={dialog.decision} onClose={close} />
      )}
    </RequestDialogsContext>
  );
}
