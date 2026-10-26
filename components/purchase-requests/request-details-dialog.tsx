"use client";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PurchaseRequest } from "@/types/purchase-request";
import styles from "./purchase-requests.module.css";

interface RequestDetailsDialogProps {
  request: PurchaseRequest;
  onClose: () => void;
}

export function RequestDetailsDialog({ request, onClose }: RequestDetailsDialogProps) {
  return (
    <Modal open onClose={onClose} title={request.title}>
      <dl className={styles.details}>
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={request.status} />
          </dd>
        </div>
        <div>
          <dt>Valor estimado</dt>
          <dd className={styles.detailsAmount}>{formatCurrency(request.estimatedAmount)}</dd>
        </div>
        <div>
          <dt>Solicitante</dt>
          <dd>{request.requester.name}</dd>
        </div>
        <div>
          <dt>Criada em</dt>
          <dd>{formatDateTime(request.createdAt)}</dd>
        </div>
        {request.decidedAt && (
          <div>
            <dt>Decisão em</dt>
            <dd>{formatDateTime(request.decidedAt)}</dd>
          </div>
        )}
        <div className={styles.detailsWide}>
          <dt>Descrição</dt>
          <dd>{request.description || "Nenhuma descrição informada."}</dd>
        </div>
        {request.decisionReason && (
          <div className={styles.detailsWide}>
            <dt>Justificativa da decisão</dt>
            <dd>{request.decisionReason}</dd>
          </div>
        )}
        <div className={styles.detailsWide}>
          <dt>Identificador</dt>
          <dd className={styles.mono}>{request.id}</dd>
        </div>
      </dl>
    </Modal>
  );
}
