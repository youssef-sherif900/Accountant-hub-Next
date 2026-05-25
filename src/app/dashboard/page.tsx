"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Bid, PaginatedResponse } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login";
    }
  }, [authLoading, user]);

  const { data: summary } = useQuery({
    queryKey: ["bids-summary"],
    queryFn: async () => {
      const { data } = await api.get<{ total: number; active: number; won: number }>(
        "/my-bids/summary"
      );
      return data;
    },
    enabled: !!user,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["my-bids", statusFilter, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), per_page: "10", sort });
      if (statusFilter) params.set("status", statusFilter);
      const { data: res } = await api.get<PaginatedResponse<Bid>>(
        `/my-bids?${params.toString()}`
      );
      return res;
    },
    enabled: !!user,
  });

  if (authLoading || !user) {
    return <div className="container">Loading…</div>;
  }

  const bids = data?.data ?? [];

  return (
    <div className="container dashboard">
      <header className="page-header">
        <h1>My Bids</h1>
        <p>Track all proposals you have submitted.</p>
      </header>

      <div className="stat-cards">
        <div className="stat card">
          <span className="label">Total bids</span>
          <strong>{summary?.total ?? 0}</strong>
        </div>
        <div className="stat card">
          <span className="label">Active bids</span>
          <strong>{summary?.active ?? 0}</strong>
        </div>
        <div className="stat card">
          <span className="label">Won bids</span>
          <strong>{summary?.won ?? 0}</strong>
        </div>
      </div>

      <div className="toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open jobs</option>
          <option value="closed">Closed jobs</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="amount_high">Highest amount</option>
          <option value="amount_low">Lowest amount</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading bids…</p>
      ) : bids.length === 0 ? (
        <div className="empty-state card">
          <h3>No bids yet</h3>
          <p>You haven&apos;t submitted any bids yet. Browse available jobs.</p>
          <Link href="/jobs" className="btn btn-primary">
            Browse jobs
          </Link>
        </div>
      ) : (
        <>
          <div className="bids-cards">
            {bids.map((bid) => (
              <article key={bid.id} className="bid-card card">
                <div className="bid-card-head">
                  {bid.job ? (
                    <Link href={`/jobs/${bid.job.slug}`} className="bid-title">
                      {bid.job.title}
                    </Link>
                  ) : (
                    <span className="bid-title">—</span>
                  )}
                  {bid.job && (
                    <span className={`badge badge-${bid.job.status}`}>
                      {bid.job.status}
                    </span>
                  )}
                </div>
                <p className="bid-company">{bid.job?.company_name ?? "—"}</p>
                <dl className="bid-meta">
                  <div>
                    <dt>My bid</dt>
                    <dd>${bid.proposed_price.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{bid.estimated_delivery_time}</dd>
                  </div>
                  <div>
                    <dt>Submitted</dt>
                    <dd>{bid.submitted_at}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>My bid</th>
                  <th>Delivery</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id}>
                    <td>
                      {bid.job ? (
                        <Link href={`/jobs/${bid.job.slug}`}>{bid.job.title}</Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{bid.job?.company_name ?? "—"}</td>
                    <td>${bid.proposed_price.toLocaleString()}</td>
                    <td>{bid.estimated_delivery_time}</td>
                    <td>{bid.submitted_at}</td>
                    <td>
                      {bid.job && (
                        <span className={`badge badge-${bid.job.status}`}>
                          {bid.job.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.meta && data.meta.last_page > 1 && (
            <div className="table-pagination">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={page >= data.meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .page-header p {
          color: var(--color-gray-500);
          margin: 0;
        }
        .stat-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }
        .stat {
          padding: var(--space-md);
          text-align: center;
        }
        .stat .label {
          color: var(--color-gray-500);
          font-size: 0.8rem;
        }
        .stat strong {
          display: block;
          font-size: 1.5rem;
          font-family: var(--font-heading);
          color: var(--color-primary);
          margin-top: var(--space-xs);
        }
        .toolbar {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }
        .toolbar select {
          width: 100%;
          padding: 0.75rem 1rem;
          min-height: var(--touch-min, 44px);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-gray-300);
          font-size: 16px;
          background: var(--color-white);
        }
        .bids-cards {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }
        .bid-card {
          padding: var(--space-md);
        }
        .bid-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-sm);
          margin-bottom: var(--space-xs);
        }
        .bid-title {
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.35;
          flex: 1;
          color: var(--color-dark);
        }
        .bid-company {
          color: var(--color-gray-500);
          font-size: 0.9rem;
          margin: 0 0 var(--space-md);
        }
        .bid-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-sm);
          margin: 0;
        }
        .bid-meta div {
          min-width: 0;
        }
        .bid-meta dt {
          font-size: 0.75rem;
          color: var(--color-gray-500);
          margin-bottom: 2px;
        }
        .bid-meta dd {
          margin: 0;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .table-wrap {
          display: none;
          overflow-x: auto;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: var(--space-md);
          text-align: left;
          border-bottom: 1px solid var(--color-gray-100);
          font-size: 0.9rem;
        }
        th {
          background: var(--color-bg);
          font-weight: 600;
        }
        .table-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-sm);
          padding: var(--space-md) 0;
          flex-wrap: wrap;
        }
        .table-pagination .btn {
          flex: 1;
          min-width: 0;
        }
        .table-pagination span {
          font-size: 0.9rem;
          color: var(--color-gray-500);
          text-align: center;
          width: 100%;
          order: -1;
        }

        @media (max-width: 480px) {
          .stat-cards {
            grid-template-columns: 1fr;
            gap: var(--space-sm);
          }
          .stat {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
          }
          .stat strong {
            font-size: 1.75rem;
            margin-top: 0;
          }
          .bid-meta {
            grid-template-columns: 1fr 1fr;
          }
          .bid-meta div:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (min-width: 640px) {
          .toolbar {
            flex-direction: row;
          }
          .toolbar select {
            flex: 1;
            width: auto;
          }
          .stat-cards {
            gap: var(--space-lg);
          }
          .stat {
            padding: var(--space-lg);
          }
          .stat strong {
            font-size: 2rem;
          }
        }

        @media (min-width: 768px) {
          .bids-cards {
            display: none;
          }
          .table-wrap {
            display: block;
          }
          .table-pagination {
            justify-content: center;
            gap: var(--space-md);
          }
          .table-pagination .btn {
            flex: none;
          }
          .table-pagination span {
            width: auto;
            order: 0;
          }
        }
      `}</style>
    </div>
  );
}
