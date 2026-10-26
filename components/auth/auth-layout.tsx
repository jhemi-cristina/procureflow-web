import type { ReactNode } from "react";
import { CheckCircle2, ClipboardList, ShieldCheck, ShoppingCart, TrendingUp } from "lucide-react";
import styles from "./login.module.css";

const highlights = [
  { icon: ClipboardList, text: "Crie e acompanhe solicitações de compra em um só lugar." },
  { icon: CheckCircle2, text: "Fluxo de aprovação com rastreabilidade de cada decisão." },
  { icon: ShieldCheck, text: "Acesso seguro com autenticação JWT e perfis de permissão." },
];

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  switchPrompt: ReactNode;
}

export function AuthLayout({ title, description, children, switchPrompt }: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <aside className={styles.showcase} aria-hidden>
        <div className={styles.brand}>
          <span className={styles.brandMark}>
            <ShoppingCart size={22} strokeWidth={2.4} />
          </span>
          <span className={styles.brandName}>procureflow</span>
        </div>

        <div className={styles.showcaseCopy}>
          <h2>Compras corporativas sem planilhas e sem e-mails perdidos.</h2>
          <ul>
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span>
                  <Icon size={17} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewIcon}>
            <TrendingUp size={18} />
          </div>
          <div>
            <span>Taxa de aprovação</span>
            <strong>92%</strong>
          </div>
          <div className={styles.previewBars}>
            {[40, 62, 48, 75, 58, 88, 70].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </aside>

      <section className={styles.formSide}>
        <div className={styles.card}>
          <div className={`${styles.brand} ${styles.mobileBrand}`}>
            <span className={styles.brandMark}>
              <ShoppingCart size={22} strokeWidth={2.4} />
            </span>
            <span className={styles.brandName}>procureflow</span>
          </div>

          <header className={styles.heading}>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>

          {children}

          <p className={styles.switchPrompt}>{switchPrompt}</p>

          <p className={styles.footer}>© 2026 ProcureFlow. Todos os direitos reservados.</p>
        </div>
      </section>
    </main>
  );
}
