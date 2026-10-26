# ProcureFlow Web

Front-end do **ProcureFlow**, um sistema de gestão de solicitações de compra com fluxo de aprovação. Consome a [ProcureFlow API](../procureflow-api) (NestJS + PostgreSQL + JWT).

## Funcionalidades

- Login com JWT, sessão com expiração automática e logout em respostas `401`
- Dashboard com indicadores, gráfico mensal e solicitações pendentes calculados a partir dos dados reais
- Listagem de solicitações com busca, filtro por status e paginação
- Criar e editar rascunhos, enviar para aprovação
- Aprovar/rejeitar com justificativa (perfis `admin` e `approver`)
- Layout responsivo com menu lateral para mobile

## Stack

- **Next.js 16** (App Router, Turbopack, route groups)
- **React 19** (`use`, `useSyncExternalStore`, `useDeferredValue`)
- **TanStack Query** para cache, sincronização e mutações
- **React Hook Form + Zod** para formulários e validação
- **CSS Modules** com design tokens globais
- **TypeScript** estrito

## Estrutura

```
app/
  (dashboard)/          # rotas autenticadas (layout com RequireAuth + AppShell)
    page.tsx            # /            → visão geral
    solicitacoes/       # /solicitacoes → listagem
  login/                # /login
  providers.tsx         # QueryClient, Auth e Toast providers
components/
  ui/                   # componentes genéricos (Button, Modal, TextField, Panel...)
  layout/               # AppShell, Sidebar, Topbar
  auth/                 # tela de login e guards de rota
  dashboard/            # cards, gráfico e painéis da visão geral
  purchase-requests/    # tabela, ações e diálogos de solicitações
contexts/               # AuthContext, ToastContext, RequestDialogsContext
hooks/                  # useAuth, usePurchaseRequests, usePagination, useRequestStats...
lib/
  api/                  # cliente HTTP e serviços por recurso
  auth/                 # store da sessão (sessionStorage)
types/                  # contratos da API
```

## Como rodar

1. Suba a API (porta `3000`, que libera CORS para `http://localhost:3001`).
2. Configure o front:

   ```bash
   cp .env.example .env.local
   npm install
   npm run dev
   ```

3. Acesse [http://localhost:3001](http://localhost:3001).

| Script          | Descrição                          |
| --------------- | ---------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento (3001) |
| `npm run build` | Build de produção                  |
| `npm run start` | Servidor de produção (3001)        |
| `npm run lint`  | ESLint                             |
