import { useMemo } from "react";
import type { PurchaseRequest } from "@/types/purchase-request";

const MONTHS_IN_CHART = 6;

export interface MonthlyPoint {
  key: string;
  label: string;
  created: number;
  approved: number;
}

export interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  drafts: number;
  totalAmount: number;
  approvedAmount: number;
  approvalRate: number;
  monthly: MonthlyPoint[];
}

const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "short" });

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function buildMonthlySeries(requests: PurchaseRequest[], now: Date): MonthlyPoint[] {
  const points = Array.from({ length: MONTHS_IN_CHART }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (MONTHS_IN_CHART - 1 - index), 1);
    return {
      key: monthKey(date),
      label: monthLabel.format(date).replace(".", ""),
      created: 0,
      approved: 0,
    };
  });
  const byKey = new Map(points.map((point) => [point.key, point]));

  for (const request of requests) {
    const created = byKey.get(monthKey(new Date(request.createdAt)));
    if (created) created.created += 1;

    if (request.status === "approved" && request.decidedAt) {
      const decided = byKey.get(monthKey(new Date(request.decidedAt)));
      if (decided) decided.approved += 1;
    }
  }

  return points;
}

export function useRequestStats(requests: PurchaseRequest[], now: Date): RequestStats {
  return useMemo(() => {
    const count = (status: PurchaseRequest["status"]) =>
      requests.filter((request) => request.status === status).length;
    const sum = (list: PurchaseRequest[]) =>
      list.reduce((total, request) => total + Number(request.estimatedAmount), 0);

    const approved = count("approved");
    const rejected = count("rejected");
    const decided = approved + rejected;

    return {
      total: requests.length,
      pending: count("pending"),
      approved,
      rejected,
      drafts: count("draft"),
      totalAmount: sum(requests),
      approvedAmount: sum(requests.filter((request) => request.status === "approved")),
      approvalRate: decided === 0 ? 0 : Math.round((approved / decided) * 100),
      monthly: buildMonthlySeries(requests, now),
    };
  }, [requests, now]);
}
