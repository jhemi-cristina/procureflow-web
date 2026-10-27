import type { Metadata } from "next";
import { UsersView } from "@/components/users/users-view";

export const instant = false;

export const metadata: Metadata = {
  title: "Usuários",
};

export default function UsersPage() {
  return <UsersView />;
}
