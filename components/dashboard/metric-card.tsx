import type { LucideIcon } from "lucide-react";
import styles from "./dashboard.module.css";

export type MetricTone = "violet" | "amber" | "green" | "blue";

interface MetricCardProps {
  title: string;
  value: string;
  footnote: string;
  icon: LucideIcon;
  tone: MetricTone;
}

export function MetricCard({ title, value, footnote, icon: Icon, tone }: MetricCardProps) {
  return (
    <article className={styles.metricCard}>
      <span className={`${styles.metricIcon} ${styles[tone]}`}>
        <Icon size={19} strokeWidth={1.9} />
      </span>
      <p className={styles.metricTitle}>{title}</p>
      <strong className={styles.metricValue}>{value}</strong>
      <p className={styles.metricFootnote}>{footnote}</p>
    </article>
  );
}
