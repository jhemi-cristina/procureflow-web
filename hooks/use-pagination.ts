import { useState } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [requestedPage, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * pageSize;

  return {
    page,
    pageCount,
    pageItems: items.slice(start, start + pageSize),
    rangeStart: items.length === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, items.length),
    setPage: (next: number) => setPage(Math.min(Math.max(1, next), pageCount)),
  };
}
