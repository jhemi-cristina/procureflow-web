import type { ReactNode } from "react";
import { CircleAlert, Inbox, LoaderCircle } from "lucide-react";
import { Button } from "./button";
import styles from "./feedback.module.css";

export function Spinner({ label = "Carregando..." }: { label?: string }) {
  return (
    <span className={styles.spinnerWrap} role="status">
      <LoaderCircle size={20} className={styles.spinner} aria-hidden />
      <span>{label}</span>
    </span>
  );
}

export function FullPageLoader({ label }: { label?: string }) {
  return (
    <div className={styles.fullPage}>
      <Spinner label={label} />
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon}>{icon ?? <Inbox size={22} />}</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<CircleAlert size={22} />}
      title="Não foi possível carregar os dados"
      description={message}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Tentar novamente
          </Button>
        )
      }
    />
  );
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <div className={styles.state}>
      <Spinner label={label} />
    </div>
  );
}
