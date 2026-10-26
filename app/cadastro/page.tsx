import type { Metadata } from "next";
import { GuestOnly } from "@/components/auth/auth-guards";
import { RegisterView } from "@/components/auth/register-view";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function RegisterPage() {
  return (
    <GuestOnly>
      <RegisterView />
    </GuestOnly>
  );
}
