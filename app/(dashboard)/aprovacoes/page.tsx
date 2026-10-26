import type { Metadata } from "next";
import { ApprovalsView } from "@/components/purchase-requests/approvals-view";

export const metadata: Metadata = {
  title: "Aprovações",
};

export default function ApprovalsPage() {
  return <ApprovalsView />;
}
