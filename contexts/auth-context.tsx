"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { sessionStore } from "@/lib/auth/session-store";
import { useIsClient } from "@/hooks/use-is-client";
import type { AuthUser, LoginInput } from "@/types/auth";

// Limite do setTimeout (~24,8 dias); acima disso o timer dispararia imediatamente.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  signIn: (credentials: LoginInput) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const isClient = useIsClient();
  const session = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  );

  const signOut = useCallback(() => {
    sessionStore.clear();
    queryClient.clear();
  }, [queryClient]);

  const signIn = useCallback(async (credentials: LoginInput) => {
    const { access_token, user } = await authApi.login(credentials);
    sessionStore.save(access_token, user);
  }, []);

  // Qualquer 401 vindo da API encerra a sessão local.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  // Encerra a sessão automaticamente quando o JWT expira.
  useEffect(() => {
    if (!session?.expiresAt) return;
    const delay = Math.min(session.expiresAt - Date.now(), MAX_TIMEOUT_MS);
    const timeout = window.setTimeout(signOut, delay);
    return () => window.clearTimeout(timeout);
  }, [session?.expiresAt, signOut]);

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus = !isClient
      ? "loading"
      : session
        ? "authenticated"
        : "unauthenticated";

    return {
      status,
      user: session?.user ?? null,
      token: session?.token ?? null,
      signIn,
      signOut,
    };
  }, [isClient, session, signIn, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
