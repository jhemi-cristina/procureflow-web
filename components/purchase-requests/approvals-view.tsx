"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useApprovalQueue } from "@/hooks/use-purchase-requests";
import { getErrorMessage } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";
import { canDecide } from "@/lib/purchase-requests";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { RequestsTable } from "./requests-table";

export function ApprovalsView() {
  const { user } = useAuth();
  const { data: queue = [], isPending, isError, error, refetch } = useApprovalQueue();

  if (!canDecide(user?.role)) {
    return (
      <Panel>
        <EmptyState
          icon={<ShieldAlert size={22} />}
          title="Acesso restrito"
          description="Apenas administradores e aprovadores podem revisar solicitações."
        />
      </Panel>
    );
  }

  const totalAmount = queue.reduce((sum, request) => sum + Number(request.estimatedAmount), 0);

  return (
    <>
      <PageHeader
        eyebrow="Aprovações"
        title="Fila de aprovação"
        description="Solicitações de toda a equipe aguardando sua decisão, das mais antigas para as mais novas."
      />

      <Panel flush>
        <PanelHeader
          title={`${queue.length} ${queue.length === 1 ? "solicitação pendente" : "solicitações pendentes"}`}
          description={
            queue.length > 0 ? `Valor total em análise: ${formatCurrency(totalAmount)}` : undefined
          }
        />

        {isPending ? (
          <LoadingState label="Carregando fila de aprovação..." />
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
        ) : queue.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={22} />}
            title="Nenhuma solicitação pendente"
            description="Quando alguém enviar uma solicitação para aprovação, ela aparece aqui."
          />
        ) : (
          <RequestsTable requests={queue} />
        )}
      </Panel>
    </>
  );
}
