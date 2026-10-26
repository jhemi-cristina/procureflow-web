import type { Metadata } from "next";
import { RequestsView } from "@/components/purchase-requests/requests-view";

export const metadata: Metadata = {
  title: "Solicitações",
};

export default function RequestsPage() {
  return <RequestsView />;
}
