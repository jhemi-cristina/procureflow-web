import { ClipboardList, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Visão geral", href: "/", icon: LayoutDashboard },
  { label: "Solicitações", href: "/solicitacoes", icon: ClipboardList },
];

export function findNavItem(pathname: string) {
  return NAV_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
}
