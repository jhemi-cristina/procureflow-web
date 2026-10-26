"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleCheck, ClipboardList, Clock3, Plus, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePurchaseRequests } from "@/hooks/use-purchase-requests";
import { useRequestDialogs } from "@/hooks/use-request-dialogs";
import { useRequestStats } from "@/hooks/use-request-stats";
import { getErrorMessage } from "@/lib/api/client";
import { formatCurrency, getFirstName } from "@/lib/format";
import { Button, buttonClassName } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { RequestsTable } from "@/components/purchase-requests/requests-table";
import { MetricCard } from "./metric-card";
import { PendingApprovals } from "./pending-approvals";
import { RequestsChart } from "./requests-chart";
import styles from "./dashboard.module.css";

const RECENT_LIMIT = 5;

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function DashboardView() {
  const { user } = useAuth();
  const { openCreate } = useRequestDialogs();
  const { data: requests = [], isPending, isError, error, refetch } = usePurchaseRequests();
  // Data fixada na montagem: mantém o render puro e consistente entre re-renders.
  const [now] = useState(() => new Date());
  const stats = useRequestStats(requests, now);

  return (
    <>
      <PageHeader
        eyebrow={weekdayFormatter.format(now)}
        title={`${greetingFor(now)}, ${getFirstName(user?.name ?? "")}`}
        description="Aqui está o resumo das suas solicitações de compra."
        actions={
          <Button onClick={openCreate}>
            <Plus size={18} strokeWidth={2.4} />
            Nova solicitação
          </Button>
        }
      />

      {isPending ? (
        <Panel>
          <LoadingState label="Carregando painel..." />
        </Panel>
      ) : isError ? (
        <Panel>
          <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
        </Panel>
      ) : (
        <>
          <section className={styles.metricsGrid} aria-label="Indicadores">
            <MetricCard
              title="Total de solicitações"
              value={String(stats.total)}
              footnote={pluralize(stats.drafts, "rascunho em aberto", "rascunhos em aberto")}
              icon={ClipboardList}
              tone="violet"
            />
            <MetricCard
              title="Aguardando aprovação"
              value={String(stats.pending)}
              footnote="Enviadas e sem decisão"
              icon={Clock3}
              tone="amber"
            />
            <MetricCard
              title="Aprovadas"
              value={String(stats.approved)}
              footnote={`Taxa de aprovação de ${stats.approvalRate}%`}
              icon={CircleCheck}
              tone="green"
            />
            <MetricCard
              title="Valor solicitado"
              value={formatCurrency(stats.totalAmount, { compact: true })}
              footnote={`${formatCurrency(stats.approvedAmount, { compact: true })} aprovados`}
              icon={Wallet}
              tone="blue"
            />
          </section>

          <section className={styles.overviewGrid}>
            <RequestsChart data={stats.monthly} />
            <PendingApprovals requests={requests} />
          </section>

          <Panel flush>
            <PanelHeader
              title="Solicitações recentes"
              description="As últimas solicitações de compra criadas."
              action={
                <Link
                  href="/solicitacoes"
                  className={buttonClassName({ variant: "secondary", size: "sm" })}
                >
                  Ver todas <ArrowUpRight size={15} />
                </Link>
              }
            />
            {requests.length === 0 ? (
              <EmptyState
                title="Nenhuma solicitação ainda"
                description="Crie sua primeira solicitação de compra para começar."
                action={
                  <Button size="sm" onClick={openCreate}>
                    <Plus size={15} /> Nova solicitação
                  </Button>
                }
              />
            ) : (
              <RequestsTable requests={requests.slice(0, RECENT_LIMIT)} />
            )}
          </Panel>
        </>
      )}
    </>
  );
}
