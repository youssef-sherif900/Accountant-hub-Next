import Link from "next/link";
import { Building2, Clock, DollarSign } from "lucide-react";
import type { Job } from "@/lib/types";

function formatBudget(min: number, max: number) {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

function daysLeft(deadline: string) {
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "Deadline passed";
  if (diff === 0) return "Due today";
  return `${diff} day${diff === 1 ? "" : "s"} left`;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.slug}`} className="job-card card">
      <div className="job-card-accent" />
      <div className="job-card-body">
        <div className="job-card-top">
          <h3>{job.title}</h3>
          <span className={`badge badge-${job.status}`}>{job.status}</span>
        </div>
        <p className="company">
          <Building2 size={16} /> {job.company_name}
        </p>
        <p className="description">{job.short_description}</p>
        <div className="meta">
          <span>
            <DollarSign size={14} /> {formatBudget(job.budget_min, job.budget_max)}
          </span>
          <span>
            <Clock size={14} /> {daysLeft(job.deadline)}
          </span>
        </div>
        <div className="job-card-footer">
          {job.category && (
            <span className="badge badge-category">{job.category.name}</span>
          )}
          <span className="muted">
            {job.bids_count} bid{job.bids_count === 1 ? "" : "s"} · {job.posted_at}
          </span>
        </div>
      </div>
      <style jsx>{`
        .job-card {
          position: relative;
          display: block;
          overflow: hidden;
          transition: transform var(--transition-base),
            box-shadow var(--transition-base);
        }
        @media (hover: hover) {
          .job-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
          }
        }
        .job-card-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: transparent;
          transition: background var(--transition-base);
        }
        .job-card:hover .job-card-accent {
          background: var(--color-primary);
        }
        .job-card-body {
          padding: var(--space-lg);
          padding-left: calc(var(--space-lg) + 4px);
        }
        .job-card-top {
          display: flex;
          justify-content: space-between;
          gap: var(--space-sm);
          align-items: flex-start;
        }
        h3 {
          font-size: 1.1rem;
          margin: 0;
          flex: 1;
        }
        .company {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-gray-700);
          font-size: 0.9rem;
          margin: var(--space-sm) 0;
        }
        .description {
          color: var(--color-gray-500);
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 var(--space-md);
        }
        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-md);
          gap: var(--space-sm);
          flex-wrap: wrap;
        }
        .muted {
          color: var(--color-gray-500);
          font-size: 0.8rem;
        }

        @media (max-width: 480px) {
          .job-card-body {
            padding: var(--space-md);
            padding-left: calc(var(--space-md) + 4px);
          }
          h3 {
            font-size: 1rem;
          }
          .job-card-top {
            flex-direction: column;
            align-items: flex-start;
          }
          .meta {
            flex-direction: column;
            gap: var(--space-sm);
            align-items: flex-start;
          }
          .job-card-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </Link>
  );
}
