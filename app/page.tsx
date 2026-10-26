
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  CheckCircle2,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CircleCheck,
  ChevronDown,
  Menu,
  X,
  FileText,
  Package,
  Wallet,
} from "lucide-react";

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Solicitações", icon: ClipboardList, count: "12" },
  { label: "Aprovações", icon: CheckCircle2, count: "4" },
  { label: "Pedidos de compra", icon: ShoppingCart },
  { label: "Fornecedores", icon: Package },
  { label: "Relatórios", icon: BarChart3 },
];

const requests = [
  {
    id: "REQ-2026-0128",
    title: "Licenças de software",
    category: "Tecnologia",
    requester: "Mariana Costa",
    initials: "MC",
    color: "purple",
    date: "26 out, 2026",
    amount: "R$ 4.890,00",
    status: "Em aprovação",
  },
  {
    id: "REQ-2026-0127",
    title: "Material de escritório",
    category: "Suprimentos",
    requester: "Rafael Mendes",
    initials: "RM",
    color: "blue",
    date: "25 out, 2026",
    amount: "R$ 1.250,00",
    status: "Aprovada",
  },
  {
    id: "REQ-2026-0126",
    title: "Equipamentos de informática",
    category: "Tecnologia",
    requester: "Juliana Alves",
    initials: "JA",
    color: "pink",
    date: "24 out, 2026",
    amount: "R$ 8.450,00",
    status: "Em análise",
  },
  {
    id: "REQ-2026-0125",
    title: "Serviços de manutenção",
    category: "Infraestrutura",
    requester: "Pedro Henrique",
    initials: "PH",
    color: "orange",
    date: "23 out, 2026",
    amount: "R$ 2.700,00",
    status: "Rejeitada",
  },
];

const metrics = [
  {
    title: "Total de solicitações",
    value: "248",
    change: "+12,8%",
    direction: "up",
    description: "em relação ao mês passado",
    icon: ClipboardList,
    iconColor: "violet",
    chart: [35, 50, 42, 64, 48, 75, 60, 88, 68, 95, 78, 100],
  },
  {
    title: "Aguardando aprovação",
    value: "18",
    change: "-4,3%",
    direction: "down",
    description: "em relação ao mês passado",
    icon: Clock3,
    iconColor: "amber",
    chart: [70, 55, 72, 45, 62, 40, 54, 32, 47, 35, 25, 30],
  },
  {
    title: "Aprovadas",
    value: "186",
    change: "+8,2%",
    direction: "up",
    description: "em relação ao mês passado",
    icon: CircleCheck,
    iconColor: "green",
    chart: [25, 40, 35, 55, 45, 70, 58, 78, 70, 88, 80, 100],
  },
  {
    title: "Valor solicitado",
    value: "R$ 84,2 mil",
    change: "+6,1%",
    direction: "up",
    description: "em relação ao mês passado",
    icon: Wallet,
    iconColor: "blue",
    chart: [30, 42, 35, 60, 50, 68, 58, 75, 65, 88, 78, 100],
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Em aprovação": "status-pending",
    "Em análise": "status-review",
    Aprovada: "status-approved",
    Rejeitada: "status-rejected",
  };

  return (
    <span className={`status-badge ${styles[status] ?? "status-review"}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState("Visão geral");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Este mês");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredRequests = requests.filter((request) =>
    `${request.id} ${request.title} ${request.requester} ${request.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Fechar menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <ShoppingCart size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-copy">
            <span className="brand-name">procureflow</span>
            <span className="brand-subtitle">GESTÃO INTELIGENTE</span>
          </div>
          <button
            className="icon-button sidebar-close"
            aria-label="Fechar menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">AC</div>
          <div className="workspace-copy">
            <span className="workspace-label">ESPAÇO DE TRABALHO</span>
            <strong>Acme Corporation</strong>
          </div>
          <ChevronDown size={16} className="workspace-chevron" />
        </div>

        <div className="nav-section-label">MENU PRINCIPAL</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.label;

            return (
              <button
                key={item.label}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                onClick={() => {
                  setActivePage(item.label);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
                {item.count && (
                  <span className={`nav-count ${isActive ? "nav-count-active" : ""}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="nav-section-label tools-label">PREFERÊNCIAS</div>
        <nav className="main-nav" aria-label="Preferências">
          <button
            className={`nav-item ${activePage === "Usuários" ? "nav-item-active" : ""}`}
            onClick={() => setActivePage("Usuários")}
          >
            <Users size={19} strokeWidth={1.8} />
            <span>Usuários</span>
          </button>
          <button
            className={`nav-item ${activePage === "Configurações" ? "nav-item-active" : ""}`}
            onClick={() => setActivePage("Configurações")}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Configurações</span>
          </button>
        </nav>

        <div className="sidebar-spacer" />

        <div className="help-card">
          <div className="help-icon">
            <FileText size={18} />
          </div>
          <strong>Precisa de ajuda?</strong>
          <p>Acesse nossa central de ajuda e encontre respostas.</p>
          <button onClick={() => window.alert("Central de ajuda em desenvolvimento.")}>
            Acessar central <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">JS</div>
          <div className="profile-copy">
            <strong>Jhemily Souza</strong>
            <span>Administradora</span>
          </div>
          <button
            className="icon-button profile-menu"
            aria-label="Opções do perfil"
            onClick={() => window.alert("Menu do perfil em desenvolvimento.")}
          >
            <ChevronDown size={17} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={21} />
            </button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-separator">/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar solicitações..."
                aria-label="Buscar solicitações"
              />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="icon-button notification-button"
              aria-label="Notificações"
              onClick={() => window.alert("Você não tem novas notificações.")}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="topbar-divider" />
            <div className="topbar-profile">
              <div className="profile-avatar profile-avatar-small">JS</div>
              <div className="topbar-profile-copy">
                <strong>Jhemily Souza</strong>
                <span>Administradora</span>
              </div>
              <ChevronDown size={15} className="profile-chevron" />
            </div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                SEGUNDA-FEIRA, 26 DE OUTUBRO
              </div>
              <h1>
                Bom dia, Jhemily <span className="wave">✦</span>
              </h1>
              <p className="welcome-subtitle">
                Aqui está o resumo das compras e solicitações da sua empresa.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => window.alert("Formulário de nova solicitação em desenvolvimento.")}
            >
              <Plus size={18} strokeWidth={2.4} />
              Nova solicitação
            </button>
          </section>

          <section className="metrics-grid" aria-label="Indicadores">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const TrendIcon =
                metric.direction === "up" ? ArrowUpRight : ArrowDownRight;

              return (
                <article className="metric-card" key={metric.title}>
                  <div className="metric-top">
                    <div className={`metric-icon metric-icon-${metric.iconColor}`}>
                      <Icon size={19} strokeWidth={1.9} />
                    </div>
                    <button
                      className="metric-more"
                      aria-label={`Mais opções: ${metric.title}`}
                      onClick={() => window.alert("Detalhes em desenvolvimento.")}
                    >
                      ···
                    </button>
                  </div>
                  <p className="metric-title">{metric.title}</p>
                  <div className="metric-value-row">
                    <strong className="metric-value">{metric.value}</strong>
                    <div className={`metric-chart metric-chart-${metric.iconColor}`}>
                      {metric.chart.map((height, index) => (
                        <span
                          key={index}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="metric-footer">
                    <span className={`trend trend-${metric.direction}`}>
                      <TrendIcon size={14} />
                      {metric.change}
                    </span>
                    <span>{metric.description}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="overview-grid">
            <article className="panel spending-panel">
              <div className="panel-header">
                <div>
                  <h2>Visão geral das solicitações</h2>
                  <p>Acompanhe a evolução das solicitações de compra.</p>
                </div>
                <label className="select-wrapper">
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    aria-label="Período do relatório"
                  >
                    <option>Esta semana</option>
                    <option>Este mês</option>
                    <option>Este ano</option>
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>

              <div className="chart-legend">
                <span><i className="legend-dot legend-primary" /> Solicitações</span>
                <span><i className="legend-dot legend-secondary" /> Aprovadas</span>
              </div>

              <div className="chart-area">
                <div className="chart-y-labels">
                  <span>250</span>
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                <div className="chart-canvas">
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <div className="chart-grid-line" key={line} />
                  ))}
                  <svg
                    className="chart-svg"
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label={`Gráfico demonstrativo de solicitações e aprovações: ${period}`}
                  >
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6558e8" stopOpacity=".16" />
                        <stop offset="100%" stopColor="#6558e8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 152 C35 146 38 130 75 135 S125 105 150 117 S200 83 225 100 S275 63 300 78 S350 55 375 70 S425 32 450 50 S500 28 525 42 S570 17 600 22 L600 200 L0 200 Z"
                      fill="url(#chartFill)"
                    />
                    <path
                      d="M0 152 C35 146 38 130 75 135 S125 105 150 117 S200 83 225 100 S275 63 300 78 S350 55 375 70 S425 32 450 50 S500 28 525 42 S570 17 600 22"
                      fill="none"
                      stroke="#6558e8"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M0 174 C35 166 48 173 75 161 S125 147 150 155 S200 131 225 143 S275 118 300 130 S350 110 375 119 S425 91 450 104 S500 86 525 98 S570 75 600 83"
                      fill="none"
                      stroke="#a9a4ef"
                      strokeWidth="2.5"
                      strokeDasharray="5 5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
              <div className="chart-x-labels">
                {["01", "05", "10", "15", "20", "25", "30"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </article>

            <article className="panel approval-panel">
              <div className="panel-header">
                <div>
                  <h2>Aprovações pendentes</h2>
                  <p>Solicitações que precisam da sua atenção.</p>
                </div>
                <span className="pending-count">4</span>
              </div>

              <div className="approval-list">
                {[
                  { initials: "MC", name: "Mariana Costa", title: "Licenças de software", amount: "R$ 4.890", color: "purple", time: "Há 25 min" },
                  { initials: "JA", name: "Juliana Alves", title: "Equipamentos de TI", amount: "R$ 8.450", color: "pink", time: "Há 1 hora" },
                  { initials: "PH", name: "Pedro Henrique", title: "Serviços de manutenção", amount: "R$ 2.700", color: "orange", time: "Há 3 horas" },
                ].map((approval) => (
                  <div className="approval-item" key={approval.name}>
                    <div className={`requester-avatar avatar-${approval.color}`}>
                      {approval.initials}
                    </div>
                    <div className="approval-copy">
                      <strong>{approval.title}</strong>
                      <span>{approval.name} · {approval.time}</span>
                    </div>
                    <strong className="approval-amount">{approval.amount}</strong>
                  </div>
                ))}
              </div>

              <button
                className="text-button"
                onClick={() => setActivePage("Aprovações")}
              >
                Ver todas as aprovações <ArrowUpRight size={16} />
              </button>
            </article>
          </section>

          <section className="panel requests-panel">
            <div className="panel-header requests-header">
              <div>
                <h2>Solicitações recentes</h2>
                <p>Visualize e acompanhe as últimas solicitações de compra.</p>
              </div>
              <button
                className="secondary-button"
                onClick={() => setActivePage("Solicitações")}
              >
                Ver todas <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="table-scroll">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Solicitação</th>
                    <th>Solicitante</th>
                    <th>Data</th>
                    <th>Valor total</th>
                    <th>Status</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="request-title-cell">
                          <div className="request-file-icon">
                            <FileText size={17} />
                          </div>
                          <div>
                            <strong>{request.title}</strong>
                            <span>{request.id} · {request.category}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="requester-cell">
                          <div className={`requester-avatar avatar-${request.color}`}>
                            {request.initials}
                          </div>
                          <span>{request.requester}</span>
                        </div>
                      </td>
                      <td className="date-cell">{request.date}</td>
                      <td className="amount-cell">{request.amount}</td>
                      <td><StatusBadge status={request.status} /></td>
                      <td>
                        <button
                          className="row-action"
                          aria-label={`Ver solicitação ${request.id}`}
                          onClick={() => window.alert(`Detalhes de ${request.id} em desenvolvimento.`)}
                        >
                          ···
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        Nenhuma solicitação encontrada para &quot;{search}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>Mostrando <strong>{filteredRequests.length}</strong> de <strong>248</strong> solicitações</span>
              <div className="pagination">
                <button disabled aria-label="Página anterior">‹</button>
                <button className="page-active">1</button>
                <button onClick={() => window.alert("Paginação será conectada à API.")}>2</button>
                <button onClick={() => window.alert("Paginação será conectada à API.")}>3</button>
                <span>...</span>
                <button onClick={() => window.alert("Paginação será conectada à API.")}>25</button>
                <button aria-label="Próxima página" onClick={() => window.alert("Paginação será conectada à API.")}>›</button>
              </div>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 ProcureFlow. Todos os direitos reservados.</span>
            <span><span className="footer-status-dot" /> Todos os sistemas operacionais</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
