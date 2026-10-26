"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { FullPageLoader } from "@/components/ui/feedback";
import type { AuthStatus } from "@/contexts/auth-context";

function useRedirectWhen(status: AuthStatus, target: AuthStatus, href: string) {
  const router = useRouter();

  useEffect(() => {
    if (status === target) router.replace(href);
  }, [status, target, href, router]);
}

/** Renderiza o conteúdo apenas para usuários autenticados; senão, redireciona ao login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  useRedirectWhen(status, "unauthenticated", "/login");

  if (status !== "authenticated") {
    return <FullPageLoader label="Verificando sua sessão..." />;
  }

  return children;
}

/** Usado em telas públicas (login): quem já está autenticado vai direto ao dashboard. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  useRedirectWhen(status, "authenticated", "/");

  if (status === "authenticated") {
    return <FullPageLoader label="Redirecionando..." />;
  }

  return children;
}
