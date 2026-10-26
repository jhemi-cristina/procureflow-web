import { CheckCircle2, ClipboardList, LayoutDashboard, type LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Visão geral", href: "/", icon: LayoutDashboard },
  { label: "Solicitações", href: "/solicitacoes", icon: ClipboardList },
  { label: "Aprovações", href: "/aprovacoes", icon: CheckCircle2, roles: ["admin", "approver"] },
];

export function navItemsFor(role: UserRole | undefined) {
  return NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)));
}

export function findNavItem(pathname: string) {
  return NAV_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
}
