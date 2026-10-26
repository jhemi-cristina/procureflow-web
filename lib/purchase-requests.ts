import type { UserRole } from "@/types/auth";
import type { PurchaseRequestStatus } from "@/types/purchase-request";

export type StatusTone = "neutral" | "warning" | "success" | "danger" | "muted";

export const STATUS_META: Record<PurchaseRequestStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Rascunho", tone: "neutral" },
  pending: { label: "Em aprovação", tone: "warning" },
  approved: { label: "Aprovada", tone: "success" },
  rejected: { label: "Rejeitada", tone: "danger" },
  cancelled: { label: "Cancelada", tone: "muted" },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador(a)",
  approver: "Aprovador(a)",
  requester: "Solicitante",
};

export function canDecide(role: UserRole | undefined) {
  return role === "admin" || role === "approver";
}
