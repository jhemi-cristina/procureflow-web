import type { Metadata } from "next";
import { GuestOnly } from "@/components/auth/auth-guards";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginView />
    </GuestOnly>
  );
}
