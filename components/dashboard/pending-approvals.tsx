"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRequestDialogs } from "@/hooks/use-request-dialogs";
import { canDecide } from "@/lib/purchase-requests";
import { formatCurrency, formatDate } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/feedback";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { PurchaseRequest } from "@/types/purchase-request";
import styles from "./dashboard.module.css";

const MAX_ITEMS = 4;

export function PendingApprovals({ requests }: { requests: PurchaseRequest[] }) {
  const { user } = useAuth();
  const { openDetails } = useRequestDialogs();
  const pending = requests.filter((request) => request.status === "pending");
  const isApprover = canDecide(user?.role);

  return (
    <Panel className={styles.approvalsPanel}>
      <PanelHeader
        title="Aguardando aprovação"
        description={
          isApprover
            ? "Solicitações que precisam da sua decisão."
            : "Solicitações enviadas e aguardando o aprovador."
        }
        action={<span className={styles.pendingCount}>{pending.length}</span>}
      />

      {pending.length === 0 ? (
        <EmptyState
          icon={<Clock3 size={22} />}
          title="Tudo em dia"
          description="Nenhuma solicitação pendente no momento."
        />
      ) : (
        <ul className={styles.approvalList}>
          {pending.slice(0, MAX_ITEMS).map((request) => (
            <li key={request.id}>
              <button type="button" onClick={() => openDetails(request)}>
                <Avatar name={request.requester.name} />
                <span className={styles.approvalCopy}>
                  <strong>{request.title}</strong>
                  <span>
                    {request.requester.name} · {formatDate(request.createdAt)}
                  </span>
                </span>
                <strong className={styles.approvalAmount}>
                  {formatCurrency(request.estimatedAmount)}
                </strong>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Link href="/solicitacoes" className={styles.textLink}>
        Ver todas as solicitações <ArrowUpRight size={16} />
      </Link>
    </Panel>
  );
}
