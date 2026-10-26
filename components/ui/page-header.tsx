import type { ReactNode } from "react";
import styles from "./page-header.module.css";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <section className={styles.header}>
      <div>
        {eyebrow && (
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
