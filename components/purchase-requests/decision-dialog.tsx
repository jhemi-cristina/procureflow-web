"use client";

import { useState } from "react";
import { useDecidePurchaseRequest } from "@/hooks/use-purchase-requests";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TextAreaField } from "@/components/ui/text-field";
import type { PurchaseRequest, PurchaseRequestDecision } from "@/types/purchase-request";
import styles from "./purchase-requests.module.css";

const MAX_REASON_LENGTH = 1000;

interface DecisionDialogProps {
  request: PurchaseRequest;
  decision: PurchaseRequestDecision;
  onClose: () => void;
}

export function DecisionDialog({ request, decision, onClose }: DecisionDialogProps) {
  const toast = useToast();
  const decide = useDecidePurchaseRequest();
  const [reason, setReason] = useState("");
  const isApproval = decision === "approved";

  const confirm = async () => {
    try {
      await decide.mutateAsync({
        id: request.id,
        decision,
        reason: reason.trim() || undefined,
      });
      toast.success(isApproval ? "Solicitação aprovada." : "Solicitação rejeitada.");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      title={isApproval ? "Aprovar solicitação" : "Rejeitar solicitação"}
      description={`${request.title} · ${formatCurrency(request.estimatedAmount)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={decide.isPending}>
            Cancelar
          </Button>
          <Button
            variant={isApproval ? "success" : "danger"}
            onClick={confirm}
            loading={decide.isPending}
          >
            {isApproval ? "Confirmar aprovação" : "Confirmar rejeição"}
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <TextAreaField
          label="Justificativa"
          placeholder={
            isApproval
              ? "Opcional: registre o motivo da aprovação"
              : "Explique ao solicitante o motivo da rejeição"
          }
          maxLength={MAX_REASON_LENGTH}
          hint={`${reason.length}/${MAX_REASON_LENGTH} caracteres`}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
    </Modal>
  );
}
