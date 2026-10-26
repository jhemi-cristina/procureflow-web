import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./pagination.module.css";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/** Retorna as páginas visíveis, com reticências quando há muitas páginas. */
function visiblePages(page: number, pageCount: number): (number | "ellipsis")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  return sorted.flatMap((value, index) =>
    index > 0 && value - sorted[index - 1] > 1 ? (["ellipsis", value] as const) : [value],
  );
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft size={15} />
      </button>
      {visiblePages(page, pageCount).map((value, index) =>
        value === "ellipsis" ? (
          <span key={`ellipsis-${index}`}>…</span>
        ) : (
          <button
            type="button"
            key={value}
            className={value === page ? styles.active : undefined}
            aria-current={value === page ? "page" : undefined}
            onClick={() => onPageChange(value)}
          >
            {value}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Próxima página"
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
