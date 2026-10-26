"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Plus, Search, SearchX } from "lucide-react";
import { usePurchaseRequests } from "@/hooks/use-purchase-requests";
import { useRequestDialogs } from "@/hooks/use-request-dialogs";
import { usePagination } from "@/hooks/use-pagination";
import { getErrorMessage } from "@/lib/api/client";
import { STATUS_META } from "@/lib/purchase-requests";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { PurchaseRequest, PurchaseRequestStatus } from "@/types/purchase-request";
import { RequestsTable } from "./requests-table";
import styles from "./requests-view.module.css";

const PAGE_SIZE = 8;
const STATUS_FILTERS: ("all" | PurchaseRequestStatus)[] = [
  "all",
  "draft",
  "pending",
  "approved",
  "rejected",
];

type StatusFilter = (typeof STATUS_FILTERS)[number];

function filterRequests(requests: PurchaseRequest[], search: string, status: StatusFilter) {
  const term = search.trim().toLowerCase();

  return requests.filter((request) => {
    if (status !== "all" && request.status !== status) return false;
    if (!term) return true;
    return `${request.title} ${request.description ?? ""} ${request.requester.name} ${request.id}`
      .toLowerCase()
      .includes(term);
  });
}

export function RequestsView() {
  const { data: requests = [], isPending, isError, error, refetch } = usePurchaseRequests();
  const { openCreate } = useRequestDialogs();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(
    () => filterRequests(requests, deferredSearch, status),
    [requests, deferredSearch, status],
  );
  const { page, pageCount, pageItems, rangeStart, rangeEnd, setPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: requests.length };
    for (const request of requests) counts[request.status] = (counts[request.status] ?? 0) + 1;
    return counts;
  }, [requests]);

  const changeStatus = (next: StatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        eyebrow="Compras"
        title="Solicitações"
        description="Crie, acompanhe e envie suas solicitações de compra para aprovação."
        actions={
          <Button onClick={openCreate}>
            <Plus size={18} strokeWidth={2.4} />
            Nova solicitação
          </Button>
        }
      />

      <Panel flush>
        <PanelHeader
          title="Todas as solicitações"
          description="Clique em uma solicitação para ver os detalhes."
        />

        <div className={styles.toolbar}>
          <div className={styles.tabs} role="group" aria-label="Filtrar por status">
            {STATUS_FILTERS.map((filter) => (
              <button
                type="button"
                key={filter}
                aria-pressed={status === filter}
                className={status === filter ? styles.tabActive : undefined}
                onClick={() => changeStatus(filter)}
              >
                {filter === "all" ? "Todas" : STATUS_META[filter].label}
                <span>{countByStatus[filter] ?? 0}</span>
              </button>
            ))}
          </div>

          <label className={styles.search}>
            <Search size={16} aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar por título, descrição ou ID..."
              aria-label="Buscar solicitações"
            />
          </label>
        </div>

        {isPending ? (
          <LoadingState label="Carregando solicitações..." />
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
        ) : requests.length === 0 ? (
          <EmptyState
            title="Nenhuma solicitação ainda"
            description="Crie sua primeira solicitação de compra para começar."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus size={15} /> Nova solicitação
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<SearchX size={22} />}
            title="Nenhum resultado"
            description="Ajuste a busca ou o filtro de status."
          />
        ) : (
          <>
            <RequestsTable requests={pageItems} />
            <footer className={styles.footer}>
              <span>
                Mostrando <strong>{rangeStart}</strong>–<strong>{rangeEnd}</strong> de{" "}
                <strong>{filtered.length}</strong> solicitações
              </span>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </footer>
          </>
        )}
      </Panel>
    </>
  );
}
