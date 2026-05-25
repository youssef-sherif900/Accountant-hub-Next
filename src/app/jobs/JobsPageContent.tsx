"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Category, Job, PaginatedResponse } from "@/lib/types";
import { JobCard } from "@/components/jobs/JobCard";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { JobFilters, type JobFiltersState } from "@/components/jobs/JobFilters";
import { Pagination } from "@/components/jobs/Pagination";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<JobFiltersState>({
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    budgetMin: searchParams.get("budget_min") ?? "",
    budgetMax: searchParams.get("budget_max") ?? "",
    status: searchParams.get("status") ?? "",
    sort: searchParams.get("sort") ?? "newest",
  });

  const page = Number(searchParams.get("page") ?? "1");
  const debouncedSearch = useDebounce(filters.search, 300);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.category) params.set("category", filters.category);
    if (filters.budgetMin) params.set("budget_min", filters.budgetMin);
    if (filters.budgetMax) params.set("budget_max", filters.budgetMax);
    if (filters.status) params.set("status", filters.status);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", String(page));
    params.set("per_page", "12");
    return params.toString();
  }, [debouncedSearch, filters, page]);

  useEffect(() => {
    const params = new URLSearchParams(queryString);
    router.replace(`/jobs?${params.toString()}`, { scroll: false });
  }, [queryString, router]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>("/job-categories");
      return data.data;
    },
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["jobs", queryString],
    queryFn: async () => {
      const { data: res } = await api.get<PaginatedResponse<Job>>(`/jobs?${queryString}`);
      return res;
    },
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(queryString);
      params.set("page", String(newPage));
      router.push(`/jobs?${params.toString()}`);
    },
    [queryString, router]
  );

  const handleFilterChange = (next: JobFiltersState) => {
    setFilters(next);
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.category) params.set("category", next.category);
    if (next.budgetMin) params.set("budget_min", next.budgetMin);
    if (next.budgetMax) params.set("budget_max", next.budgetMax);
    if (next.status) params.set("status", next.status);
    if (next.sort) params.set("sort", next.sort);
    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`);
  };

  const jobs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="container jobs-layout">
      <header className="page-header">
        <h1>Accounting Jobs</h1>
        <p>Browse open opportunities and submit your best bid.</p>
      </header>
      <div className="jobs-grid-layout">
        <JobFilters
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
        />
        <section>
          {isLoading || isFetching ? (
            <div className="jobs-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state card">
              <h3>No jobs found</h3>
              <p>No jobs match your filters. Try adjusting your search.</p>
            </div>
          ) : (
            <>
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {meta && (
                <Pagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  total={meta.total}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </div>
      <style jsx>{`
        .page-header {
          margin-bottom: var(--space-lg);
        }
        .page-header h1 {
          margin-bottom: var(--space-sm);
        }
        .page-header p {
          color: var(--color-gray-500);
          margin: 0;
          font-size: 0.95rem;
        }
        .jobs-grid-layout {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          align-items: stretch;
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }

        @media (min-width: 640px) {
          .jobs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-lg);
          }
        }

        @media (min-width: 768px) {
          .page-header {
            margin-bottom: var(--space-xl);
          }
          .jobs-grid-layout {
            display: grid;
            grid-template-columns: minmax(260px, 300px) 1fr;
            gap: var(--space-xl);
            align-items: start;
          }
          .jobs-grid-layout > :first-child {
            min-width: 0;
          }
        }

        @media (min-width: 1024px) {
          .jobs-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
