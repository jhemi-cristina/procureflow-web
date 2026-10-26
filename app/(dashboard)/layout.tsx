import { RequireAuth } from "@/components/auth/auth-guards";
import { AppShell } from "@/components/layout/app-shell";
import { RequestDialogsProvider } from "@/contexts/request-dialogs-context";

export const instant = false;

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <RequireAuth>
      <RequestDialogsProvider>
        <AppShell>{children}</AppShell>
      </RequestDialogsProvider>
    </RequireAuth>
  );
}
