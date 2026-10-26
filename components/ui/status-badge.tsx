import { STATUS_META } from "@/lib/purchase-requests";
import type { PurchaseRequestStatus } from "@/types/purchase-request";
import styles from "./status-badge.module.css";

export function StatusBadge({ status }: { status: PurchaseRequestStatus }) {
  const { label, tone } = STATUS_META[status];

  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <span className={styles.dot} aria-hidden />
      {label}
    </span>
  );
}
