import type { HTMLAttributes, ReactNode } from "react";
import styles from "./panel.module.css";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  flush?: boolean;
}

export function Panel({ flush = false, className, ...props }: PanelProps) {
  return (
    <section
      className={[styles.panel, flush && styles.flush, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

interface PanelHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PanelHeader({ title, description, action }: PanelHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
