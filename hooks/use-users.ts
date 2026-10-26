import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import type { UserRole } from "@/types/auth";
import { useAuth } from "./use-auth";

export const userKeys = {
  all: ["users"] as const,
  page: (page: number, limit: number) => ["users", page, limit] as const,
};

function requireToken(token: string | null) {
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  return token;
}

export function useUsers(page: number, limit: number) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: userKeys.page(page, limit),
    queryFn: () => usersApi.list(requireToken(token), page, limit),
    enabled: Boolean(token) && user?.role === "admin",
    placeholderData: keepPreviousData,
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: userKeys.all });
}

export function useUpdateUserRole() {
  const { token } = useAuth();
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      usersApi.updateRole(requireToken(token), id, role),
    onSettled: invalidate,
  });
}

export function useSetUserActive() {
  const { token } = useAuth();
  const invalidate = useInvalidateUsers();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      usersApi.setActive(requireToken(token), id, active),
    onSettled: invalidate,
  });
}
