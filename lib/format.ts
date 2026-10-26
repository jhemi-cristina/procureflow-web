const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(value: string | number, { compact = false } = {}) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "—";
  return (compact ? compactCurrencyFormatter : currencyFormatter).format(amount);
}

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(new Date(value));
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Converte "1.250,50" ou "1250.50" para o formato aceito pela API ("1250.50"). */
export function toApiAmount(value: string) {
  const normalized = value.trim().replace(/\s|R\$/g, "");
  const decimal = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : normalized;
  return Number(decimal).toFixed(2);
}

/** Converte "1250.50" (API) para "1250,50" (input do formulário). */
export function fromApiAmount(value: string) {
  return Number(value).toFixed(2).replace(".", ",");
}
