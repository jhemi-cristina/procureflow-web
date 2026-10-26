"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABELS } from "@/lib/purchase-requests";
import { Avatar } from "@/components/ui/avatar";
import { findNavItem, NAV_ITEMS } from "./navigation";
import styles from "./sidebar.module.css";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const activeItem = findNavItem(pathname);

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>
          <ShoppingCart size={22} strokeWidth={2.5} />
        </span>
        <span className={styles.brandCopy}>
          <span className={styles.brandName}>procureflow</span>
          <span className={styles.brandSubtitle}>GESTÃO INTELIGENTE</span>
        </span>
        <button type="button" className={styles.close} aria-label="Fechar menu" onClick={onNavigate}>
          <X size={19} />
        </button>
      </div>

      <p className={styles.sectionLabel}>MENU PRINCIPAL</p>
      <nav className={styles.nav} aria-label="Navegação principal">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = activeItem?.href === href;
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.spacer} />

      {user && (
        <div className={styles.profile}>
          <Avatar name={user.name} variant="solid" />
          <div className={styles.profileCopy}>
            <strong>{user.name}</strong>
            <span>{ROLE_LABELS[user.role] ?? user.role}</span>
          </div>
          <button type="button" className={styles.logout} aria-label="Sair" title="Sair" onClick={signOut}>
            <LogOut size={17} />
          </button>
        </div>
      )}
    </aside>
  );
}
