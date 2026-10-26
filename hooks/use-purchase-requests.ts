import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseRequestsApi } from "@/lib/api/purchase-requests";
import { canDecide } from "@/lib/purchase-requests";
import type {
  DecidePurchaseRequestInput,
  PurchaseRequestInput,
} from "@/types/purchase-request";
import { useAuth } from "./use-auth";

export const purchaseRequestKeys = {
  all: ["purchase-requests"] as const,
  mine: ["purchase-requests", "mine"] as const,
  approvals: ["purchase-requests", "approvals"] as const,
  team: ["purchase-requests", "team"] as const,
  recent: (limit: number) => ["purchase-requests", "recent", limit] as const,
};

function useAuthToken() {
  const { token } = useAuth();
  return token;
}

function requireToken(token: string | null) {
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");
  return token;
}

function useInvalidateRequests() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
}

export function usePurchaseRequests() {
  const token = useAuthToken();

  return useQuery({
    queryKey: purchaseRequestKeys.mine,
    queryFn: () => purchaseRequestsApi.list(requireToken(token)),
    enabled: Boolean(token),
  });
}

export function useApprovalQueue() {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: purchaseRequestKeys.approvals,
    queryFn: () => purchaseRequestsApi.approvals(requireToken(token)),
    enabled: Boolean(token) && canDecide(user?.role),
  });
}

export function useTeamRequests() {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: purchaseRequestKeys.team,
    queryFn: () => purchaseRequestsApi.team(requireToken(token)),
    enabled: Boolean(token) && canDecide(user?.role),
  });
}

export function useTeamRecentRequests(limit: number) {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: purchaseRequestKeys.recent(limit),
    queryFn: () => purchaseRequestsApi.recent(requireToken(token), limit),
    enabled: Boolean(token) && canDecide(user?.role),
  });
}

export function useCreatePurchaseRequest() {
  const token = useAuthToken();
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: async ({ input, submit }: { input: PurchaseRequestInput; submit: boolean }) => {
      const created = await purchaseRequestsApi.create(requireToken(token), input);
      return submit ? purchaseRequestsApi.submit(requireToken(token), created.id) : created;
    },
    onSettled: invalidate,
  });
}

export function useUpdatePurchaseRequest() {
  const token = useAuthToken();
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: async ({
      id,
      input,
      submit,
    }: {
      id: string;
      input: PurchaseRequestInput;
      submit: boolean;
    }) => {
      const updated = await purchaseRequestsApi.update(requireToken(token), id, input);
      return submit ? purchaseRequestsApi.submit(requireToken(token), updated.id) : updated;
    },
    onSettled: invalidate,
  });
}

export function useSubmitPurchaseRequest() {
  const token = useAuthToken();
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: (id: string) => purchaseRequestsApi.submit(requireToken(token), id),
    onSettled: invalidate,
  });
}

export function useDecidePurchaseRequest() {
  const token = useAuthToken();
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({ id, ...input }: DecidePurchaseRequestInput & { id: string }) =>
      purchaseRequestsApi.decide(requireToken(token), id, input),
    onSettled: invalidate,
  });
}
