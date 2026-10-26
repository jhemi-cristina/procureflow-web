import type { MonthlyPoint } from "@/hooks/use-request-stats";
import { Panel, PanelHeader } from "@/components/ui/panel";
import styles from "./dashboard.module.css";

export function RequestsChart({ data }: { data: MonthlyPoint[] }) {
  const max = Math.max(1, ...data.flatMap((point) => [point.created, point.approved]));
  const summary = data
    .map((point) => `${point.label}: ${point.created} criadas, ${point.approved} aprovadas`)
    .join("; ");

  return (
    <Panel className={styles.chartPanel}>
      <PanelHeader
        title="Evolução das solicitações"
        description="Solicitações criadas e aprovadas nos últimos 6 meses."
      />

      <div className={styles.legend}>
        <span>
          <i className={styles.legendCreated} /> Criadas
        </span>
        <span>
          <i className={styles.legendApproved} /> Aprovadas
        </span>
      </div>

      <div className={styles.chart} role="img" aria-label={summary}>
        {data.map((point) => (
          <div key={point.key} className={styles.chartGroup}>
            <div className={styles.chartBars}>
              <span
                className={styles.barCreated}
                style={{ height: `${(point.created / max) * 100}%` }}
                title={`${point.created} criadas`}
              >
                {point.created > 0 && <em>{point.created}</em>}
              </span>
              <span
                className={styles.barApproved}
                style={{ height: `${(point.approved / max) * 100}%` }}
                title={`${point.approved} aprovadas`}
              >
                {point.approved > 0 && <em>{point.approved}</em>}
              </span>
            </div>
            <span className={styles.chartLabel}>{point.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
