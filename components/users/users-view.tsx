"use client";

import { useState } from "react";
import { ShieldAlert, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSetUserActive, useUpdateUserRole, useUsers } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/purchase-requests";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { ManagedUser, UserRole } from "@/types/auth";
import styles from "./users.module.css";

const PAGE_SIZE = 10;
const ROLES: UserRole[] = ["admin", "approver", "requester"];

function UserRow({ user, isSelf }: { user: ManagedUser; isSelf: boolean }) {
  const toast = useToast();
  const updateRole = useUpdateUserRole();
  const setActive = useSetUserActive();

  const changeRole = async (role: UserRole) => {
    try {
      await updateRole.mutateAsync({ id: user.id, role });
      toast.success(`${user.name} agora é ${ROLE_LABELS[role]}.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleActive = async () => {
    try {
      await setActive.mutateAsync({ id: user.id, active: !user.isActive });
      toast.success(user.isActive ? `${user.name} foi desativado(a).` : `${user.name} foi reativado(a).`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <tr className={user.isActive ? undefined : styles.inactiveRow}>
      <td>
        <span className={styles.identity}>
          <Avatar name={user.name} size="sm" />
          <span>
            <strong>
              {user.name}
              {isSelf && <em className={styles.selfTag}>Você</em>}
            </strong>
            <small>{user.email}</small>
          </span>
        </span>
      </td>
      <td>
        <select
          className={styles.roleSelect}
          value={user.role}
          disabled={isSelf || updateRole.isPending}
          onChange={(event) => void changeRole(event.target.value as UserRole)}
          aria-label={`Perfil de ${user.name}`}
          title={isSelf ? "Você não pode alterar o próprio perfil." : undefined}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </td>
      <td>
        <span className={`${styles.status} ${user.isActive ? styles.active : styles.inactive}`}>
          <span className={styles.statusDot} aria-hidden />
          {user.isActive ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td className={styles.muted}>{formatDate(user.createdAt)}</td>
      <td className={styles.actionsCell}>
        {!isSelf && (
          <Button
            size="sm"
            variant={user.isActive ? "danger" : "success"}
            loading={setActive.isPending}
            onClick={() => void toggleActive()}
          >
            {!setActive.isPending &&
              (user.isActive ? <UserX size={14} /> : <UserCheck size={14} />)}
            {user.isActive ? "Desativar" : "Reativar"}
          </Button>
        )}
      </td>
    </tr>
  );
}

export function UsersView() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch } = useUsers(page, PAGE_SIZE);

  if (currentUser?.role !== "admin") {
    return (
      <Panel>
        <EmptyState
          icon={<ShieldAlert size={22} />}
          title="Acesso restrito"
          description="Apenas administradores podem gerenciar usuários."
        />
      </Panel>
    );
  }

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        description="Defina quem pode aprovar solicitações e quem administra a plataforma."
      />

      <Panel flush>
        <PanelHeader
          title={meta ? `${meta.total} ${meta.total === 1 ? "usuário" : "usuários"}` : "Usuários"}
          description="Administradores gerenciam usuários; aprovadores decidem solicitações; solicitantes criam pedidos."
        />

        {isPending ? (
          <LoadingState label="Carregando usuários..." />
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
        ) : users.length === 0 ? (
          <EmptyState title="Nenhum usuário encontrado" />
        ) : (
          <>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Usuário</th>
                    <th scope="col">Perfil</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastro</th>
                    <th scope="col" className={styles.actionsCell}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} isSelf={user.id === currentUser.id} />
                  ))}
                </tbody>
              </table>
            </div>
            {meta && meta.totalPages > 1 && (
              <footer className={styles.footer}>
                <span>
                  Página <strong>{meta.page}</strong> de <strong>{meta.totalPages}</strong>
                </span>
                <Pagination page={meta.page} pageCount={meta.totalPages} onPageChange={setPage} />
              </footer>
            )}
          </>
        )}
      </Panel>
    </>
  );
}
