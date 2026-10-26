"use client";

import { FileText } from "lucide-react";
import { useRequestDialogs } from "@/hooks/use-request-dialogs";
import { formatCurrency, formatDate } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PurchaseRequest } from "@/types/purchase-request";
import { RequestActions } from "./request-actions";
import styles from "./purchase-requests.module.css";

export function RequestsTable({ requests }: { requests: PurchaseRequest[] }) {
  const { openDetails } = useRequestDialogs();

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Solicitação</th>
            <th scope="col">Solicitante</th>
            <th scope="col">Data</th>
            <th scope="col">Valor estimado</th>
            <th scope="col">Status</th>
            <th scope="col" className={styles.actionsHeader}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>
                <button
                  type="button"
                  className={styles.titleCell}
                  onClick={() => openDetails(request)}
                >
                  <span className={styles.fileIcon}>
                    <FileText size={17} />
                  </span>
                  <span>
                    <strong>{request.title}</strong>
                    <small>#{request.id.slice(0, 8).toUpperCase()}</small>
                  </span>
                </button>
              </td>
              <td>
                <span className={styles.requester}>
                  <Avatar name={request.requester.name} size="sm" />
                  {request.requester.name}
                </span>
              </td>
              <td className={styles.muted}>{formatDate(request.createdAt)}</td>
              <td className={styles.amount}>{formatCurrency(request.estimatedAmount)}</td>
              <td>
                <StatusBadge status={request.status} />
              </td>
              <td>
                <RequestActions request={request} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
