"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTeamRecentRequests } from "@/hooks/use-purchase-requests";
import { useRequestDialogs } from "@/hooks/use-request-dialogs";
import { getErrorMessage } from "@/lib/api/client";
import { canDecide } from "@/lib/purchase-requests";
import { Button, buttonClassName } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { RequestsTable } from "@/components/purchase-requests/requests-table";
import type { PurchaseRequest } from "@/types/purchase-request";

const RECENT_LIMIT = 5;

export function RecentRequests({ requests }: { requests: PurchaseRequest[] }) {
  const { user } = useAuth();
  const { openCreate } = useRequestDialogs();
  const isApprover = canDecide(user?.role);
  const team = useTeamRecentRequests(RECENT_LIMIT);

  const items = isApprover ? (team.data ?? []) : requests.slice(0, RECENT_LIMIT);

  const renderContent = () => {
    if (isApprover && team.isPending) return <LoadingState label="Carregando solicitações..." />;
    if (isApprover && team.isError) {
      return <ErrorState message={getErrorMessage(team.error)} onRetry={() => void team.refetch()} />;
    }
    if (items.length === 0) {
      return (
        <EmptyState
          title="Nenhuma solicitação ainda"
          description={
            isApprover
              ? "Quando a equipe enviar solicitações, elas aparecem aqui."
              : "Crie sua primeira solicitação de compra para começar."
          }
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus size={15} /> Nova solicitação
            </Button>
          }
        />
      );
    }
    return <RequestsTable requests={items} />;
  };

  return (
    <Panel flush>
      <PanelHeader
        title={isApprover ? "Solicitações recentes da equipe" : "Solicitações recentes"}
        description={
          isApprover
            ? "As últimas solicitações enviadas por todos os usuários."
            : "As últimas solicitações de compra que você criou."
        }
        action={
          <Link
            href={isApprover ? "/aprovacoes" : "/solicitacoes"}
            className={buttonClassName({ variant: "secondary", size: "sm" })}
          >
            {isApprover ? "Ver aprovações" : "Ver todas"} <ArrowUpRight size={15} />
          </Link>
        }
      />
      {renderContent()}
    </Panel>
  );
}
