"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABELS } from "@/lib/purchase-requests";
import { Avatar } from "@/components/ui/avatar";
import { findNavItem } from "./navigation";
import styles from "./topbar.module.css";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const current = findNavItem(pathname);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button type="button" className={styles.menuButton} aria-label="Abrir menu" onClick={onOpenMenu}>
          <Menu size={21} />
        </button>
        <nav className={styles.breadcrumb} aria-label="Você está em">
          <span>Workspace</span>
          <span className={styles.separator}>/</span>
          <strong>{current?.label ?? "ProcureFlow"}</strong>
        </nav>
      </div>

      {user && (
        <div className={styles.profile}>
          <Avatar name={user.name} size="md" variant="solid" />
          <div className={styles.profileCopy}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <span className={styles.role}>{ROLE_LABELS[user.role] ?? user.role}</span>
        </div>
      )}
    </header>
  );
}
