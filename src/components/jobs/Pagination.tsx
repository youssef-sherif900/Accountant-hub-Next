"use client";

import { useEffect, useState } from "react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  lastPage,
  total,
  onPageChange,
}: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === lastPage ||
      (p >= currentPage - 1 && p <= currentPage + 1)
  );

  return (
    <div className="pagination">
      <p className="pagination-info">
        Page {currentPage} of {lastPage}
        <span className="total"> ({total} jobs)</span>
      </p>
      <div className="pagination-controls">
        <button
          type="button"
          className="btn btn-ghost nav-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {!isMobile &&
          pages.map((page, idx) => {
            const prev = pages[idx - 1];
            const showEllipsis = prev && page - prev > 1;
            return (
              <span key={page} className="page-group">
                {showEllipsis && <span className="ellipsis">…</span>}
                <button
                  type="button"
                  className={`btn page-btn ${page === currentPage ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </span>
            );
          })}

        <button
          type="button"
          className="btn btn-ghost nav-btn"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <style jsx>{`
        .pagination {
          margin-top: var(--space-xl);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-md);
        }
        .pagination-info {
          color: var(--color-gray-500);
          font-size: 0.9rem;
          margin: 0;
          text-align: center;
        }
        .total {
          display: inline;
        }
        .pagination-controls {
          display: flex;
          gap: var(--space-sm);
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .nav-btn {
          flex: 1;
          min-width: 0;
          max-width: 140px;
        }
        .page-group {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .page-btn {
          min-width: 40px;
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }
        .ellipsis {
          color: var(--color-gray-500);
        }

        @media (max-width: 639px) {
          .pagination-controls {
            justify-content: space-between;
          }
          .nav-btn {
            flex: 1;
            max-width: none;
          }
          .total {
            display: none;
          }
        }

        @media (min-width: 640px) {
          .pagination {
            align-items: center;
          }
          .nav-btn {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
}
