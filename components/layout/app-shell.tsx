"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import styles from "./app-shell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.shell}>
      {menuOpen && (
        <button type="button" className={styles.overlay} aria-label="Fechar menu" onClick={closeMenu} />
      )}

      <Sidebar open={menuOpen} onNavigate={closeMenu} />

      <div className={styles.main}>
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className={styles.content}>{children}</main>
        <footer className={styles.footer}>
          <span>© 2026 ProcureFlow. Todos os direitos reservados.</span>
          <span>
            <span className={styles.statusDot} /> Integrado à ProcureFlow API
          </span>
        </footer>
      </div>
    </div>
  );
}
