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
import { usersApi } from "@/lib/api/users";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { sessionStore } from "@/lib/auth/session-store";
import { useIsClient } from "@/hooks/use-is-client";
import type { AuthUser, LoginInput, RegisterInput } from "@/types/auth";

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  signIn: (credentials: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
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

  const signUp = useCallback(
    async (input: RegisterInput) => {
      await usersApi.register(input);
      try {
        await signIn({ email: input.email, password: input.password });
      } catch {
        throw new Error("Conta criada com sucesso! Faça login para continuar.");
      }
    },
    [signIn],
  );

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

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
      signUp,
      signOut,
    };
  }, [isClient, session, signIn, signUp, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
