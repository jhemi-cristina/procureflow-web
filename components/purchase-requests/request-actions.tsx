"use client";

import { Check, Eye, Pencil, Send, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRequestDialogs } from "@/hooks/use-request-dialogs";
import { useSubmitPurchaseRequest } from "@/hooks/use-purchase-requests";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/client";
import { canDecide } from "@/lib/purchase-requests";
import { Button } from "@/components/ui/button";
import type { PurchaseRequest } from "@/types/purchase-request";
import styles from "./purchase-requests.module.css";

/** Ações disponíveis conforme o status da solicitação e o perfil do usuário. */
export function RequestActions({ request }: { request: PurchaseRequest }) {
  const { user } = useAuth();
  const toast = useToast();
  const dialogs = useRequestDialogs();
  const submitRequest = useSubmitPurchaseRequest();

  const submit = async () => {
    try {
      await submitRequest.mutateAsync(request.id);
      toast.success("Solicitação enviada para aprovação.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.actions}>
      {request.status === "draft" && (
        <>
          <Button variant="ghost" size="sm" onClick={() => dialogs.openEdit(request)}>
            <Pencil size={14} /> Editar
          </Button>
          <Button variant="secondary" size="sm" onClick={submit} loading={submitRequest.isPending}>
            {!submitRequest.isPending && <Send size={14} />} Enviar
          </Button>
        </>
      )}

      {request.status === "pending" && canDecide(user?.role) && (
        <>
          <Button
            variant="success"
            size="sm"
            onClick={() => dialogs.openDecision(request, "approved")}
          >
            <Check size={14} /> Aprovar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => dialogs.openDecision(request, "rejected")}
          >
            <X size={14} /> Rejeitar
          </Button>
        </>
      )}

      <button
        type="button"
        className={styles.iconAction}
        aria-label={`Ver detalhes de ${request.title}`}
        title="Ver detalhes"
        onClick={() => dialogs.openDetails(request)}
      >
        <Eye size={16} />
      </button>
    </div>
  );
}
