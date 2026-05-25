"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, MapPin, Paperclip } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { JobDetail } from "@/lib/types";
import { BidModal } from "@/components/jobs/BidModal";

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const [showBidModal, setShowBidModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: job, isLoading, isError, error } = useQuery({
    queryKey: ["job", slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: JobDetail }>(`/jobs/${slug}`);
      return data.data;
    },
    enabled: !!slug,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="skeleton card" style={{ height: 400, padding: 24 }} />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="container">
        <div className="empty-state card">
          <h3>Job not found</h3>
          <p>
            {(error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
              "This job could not be loaded. It may have been removed."}
          </p>
          <Link href="/jobs" className="btn btn-primary">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const refreshJob = () => {
    queryClient.invalidateQueries({ queryKey: ["job", slug] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
  };

  return (
    <div className="container job-detail">
      <nav className="breadcrumbs">
        <Link href="/jobs">Jobs</Link>
        <span>/</span>
        {job.category && (
          <>
            <span>{job.category.name}</span>
            <span>/</span>
          </>
        )}
        <span>{job.title}</span>
      </nav>

      <header className="detail-header card">
        <div>
          <span className={`badge badge-${job.status}`}>{job.status}</span>
          <h1>{job.title}</h1>
          <p className="company">
            <Building2 size={18} /> {job.company_name}
          </p>
          <p className="muted">
            Posted {job.posted_at} · Deadline {job.deadline_human}
          </p>
        </div>
        <div className="budget-box">
          <span className="label">Budget</span>
          <strong>
            ${job.budget_min.toLocaleString()} – ${job.budget_max.toLocaleString()}
          </strong>
        </div>
      </header>

      <div className="detail-grid">
        <div className="main-col">
          <section className="card section">
            <h2>Job description</h2>
            <div className="description">{job.full_description}</div>
            {job.required_skills?.length > 0 && (
              <div className="skills">
                {job.required_skills.map((skill) => (
                  <span key={skill} className="badge badge-category">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {job.expected_delivery_time && (
              <p>
                <strong>Expected delivery:</strong> {job.expected_delivery_time}
              </p>
            )}
          </section>

          <section className="card section">
            <h2>Company</h2>
            <p>{job.company_description}</p>
            {job.company_location && (
              <p className="location">
                <MapPin size={16} /> {job.company_location}
              </p>
            )}
            <p className="muted">{job.company_jobs_count} jobs posted by this company</p>
          </section>

          <section className="card section">
            <h2>
              <Paperclip size={18} /> Attachments
            </h2>
            <p className="muted">No attachments for this job</p>
          </section>
        </div>

        <aside className="sidebar">
          <section className="card section">
            <h2>Bid statistics</h2>
            <p>
              <strong>{job.bids_count}</strong> bids received
            </p>
            {job.bid_stats.average != null && (
              <>
                <p>Average bid: ${job.bid_stats.average.toLocaleString()}</p>
                <p>
                  Range: ${job.bid_stats.lowest?.toLocaleString()} – $
                  {job.bid_stats.highest?.toLocaleString()}
                </p>
              </>
            )}
          </section>

          <section className="card section action-box">
            {authLoading ? null : job.status === "closed" ? (
              <p>This job is no longer accepting bids.</p>
            ) : user && job.user_has_bid ? (
              <p>
                You&apos;ve already submitted a bid.{" "}
                <Link href="/dashboard">View dashboard</Link>
              </p>
            ) : user ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowBidModal(true)}
              >
                Submit bid
              </button>
            ) : (
              <p>
                <Link href="/login" className="btn btn-primary">
                  Login to submit a bid
                </Link>
              </p>
            )}
          </section>
        </aside>
      </div>

      {showBidModal && user && (
        <BidModal
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setShowBidModal(false)}
          onSuccess={refreshJob}
        />
      )}

      <style jsx>{`
        .breadcrumbs {
          display: flex;
          flex-wrap: nowrap;
          gap: var(--space-sm);
          color: var(--color-gray-500);
          font-size: 0.85rem;
          margin-bottom: var(--space-md);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: var(--space-xs);
        }
        .breadcrumbs span:last-child {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 12rem;
        }
        .detail-header {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }
        h1 {
          font-size: 1.35rem;
          margin-top: var(--space-sm);
          line-height: 1.3;
          word-break: break-word;
        }
        .company {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-gray-700);
          flex-wrap: wrap;
        }
        .muted {
          color: var(--color-gray-500);
          font-size: 0.9rem;
        }
        .budget-box {
          text-align: left;
          padding: var(--space-md);
          background: var(--color-primary-light);
          border-radius: var(--radius-md);
          width: 100%;
        }
        .budget-box .label {
          display: block;
          color: var(--color-gray-700);
          font-size: 0.85rem;
        }
        .budget-box strong {
          font-size: 1.15rem;
          color: var(--color-primary);
          word-break: break-word;
        }
        .detail-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .sidebar {
          order: -1;
        }
        .section {
          padding: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .section h2 {
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }
        .description {
          white-space: pre-wrap;
          color: var(--color-gray-700);
          font-size: 0.95rem;
          word-break: break-word;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }
        .location {
          display: flex;
          align-items: flex-start;
          gap: var(--space-xs);
        }
        .action-box {
          text-align: center;
          position: sticky;
          bottom: var(--space-md);
          z-index: 10;
          box-shadow: var(--shadow-md);
        }
        .action-box .btn {
          width: 100%;
        }

        @media (min-width: 768px) {
          .breadcrumbs span:last-child {
            max-width: none;
          }
          .detail-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            padding: var(--space-xl);
            margin-bottom: var(--space-lg);
          }
          h1 {
            font-size: 1.75rem;
          }
          .budget-box {
            text-align: right;
            background: transparent;
            padding: 0;
            width: auto;
            flex-shrink: 0;
          }
          .budget-box strong {
            font-size: 1.25rem;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: var(--space-lg);
          }
          .sidebar {
            order: 0;
          }
          .section {
            padding: var(--space-lg);
            margin-bottom: var(--space-lg);
          }
          .action-box {
            position: static;
            box-shadow: none;
          }
        }

        @media (min-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr 320px;
          }
        }
      `}</style>
    </div>
  );
}
