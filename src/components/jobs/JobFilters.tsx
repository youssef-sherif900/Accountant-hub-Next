"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

export interface JobFiltersState {
  search: string;
  category: string;
  budgetMin: string;
  budgetMax: string;
  status: string;
  sort: string;
}

interface JobFiltersProps {
  categories: Category[];
  filters: JobFiltersState;
  onChange: (filters: JobFiltersState) => void;
}

function countActiveFilters(filters: JobFiltersState) {
  let n = 0;
  if (filters.search) n++;
  if (filters.category) n++;
  if (filters.budgetMin) n++;
  if (filters.budgetMax) n++;
  if (filters.status) n++;
  if (filters.sort && filters.sort !== "newest") n++;
  return n;
}

export function JobFilters({ categories, filters, onChange }: JobFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const activeCount = countActiveFilters(filters);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (!mobile) setExpanded(true);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const update = (patch: Partial<JobFiltersState>) =>
    onChange({ ...filters, ...patch });

  const showPanel = !isMobile || expanded;

  return (
    <aside className={`filters card ${isMobile ? "filters-mobile" : ""}`}>
      {isMobile && (
        <button
          type="button"
          className="filters-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
          <ChevronDown size={18} className={`chevron ${expanded ? "open" : ""}`} />
        </button>
      )}

      {!isMobile && <h2>Filters</h2>}

      <div className={`filters-panel ${showPanel ? "visible" : ""}`}>
        <div className="form-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Job title..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="budget-fields">
          <div className="form-group budget-field">
            <label htmlFor="budgetMin">Min budget ($)</label>
            <input
              id="budgetMin"
              type="number"
              min={0}
              placeholder="0"
              value={filters.budgetMin}
              onChange={(e) => update({ budgetMin: e.target.value })}
            />
          </div>
          <div className="form-group budget-field">
            <label htmlFor="budgetMax">Max budget ($)</label>
            <input
              id="budgetMax"
              type="number"
              min={0}
              placeholder="Any"
              value={filters.budgetMax}
              onChange={(e) => update({ budgetMax: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Status</label>
          <div className="status-tabs">
            {[
              { value: "", label: "All" },
              { value: "open", label: "Open" },
              { value: "closed", label: "Closed" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`tab ${filters.status === tab.value ? "active" : ""}`}
                onClick={() => update({ status: tab.value })}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group form-group-last">
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="budget_high">Highest budget</option>
            <option value="budget_low">Lowest budget</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        .filters {
          padding: var(--space-lg);
          width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .filters-mobile {
          padding: 0;
          position: static;
        }
        h2 {
          font-size: 1.15rem;
          margin-bottom: var(--space-md);
        }
        .filters-toggle {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          padding: var(--space-md) var(--space-lg);
          border: none;
          background: var(--color-white);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          min-height: var(--touch-min, 44px);
        }
        .filter-count {
          background: var(--color-primary);
          color: white;
          font-size: 0.75rem;
          min-width: 1.25rem;
          height: 1.25rem;
          border-radius: var(--radius-full);
          display: grid;
          place-items: center;
          padding: 0 4px;
        }
        .chevron {
          margin-left: auto;
          transition: transform 0.25s ease;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
        .filters-panel {
          padding: 0 var(--space-lg) var(--space-lg);
        }
        .filters-mobile .filters-panel {
          display: none;
        }
        .filters-mobile .filters-panel.visible {
          display: block;
          border-top: 1px solid var(--color-gray-100);
        }
        .form-group-last {
          margin-bottom: 0;
        }
        .budget-fields {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .budget-field {
          margin-bottom: var(--space-md);
        }
        .filters :global(.form-group input),
        .filters :global(.form-group select) {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .status-tabs {
          display: flex;
          gap: var(--space-xs);
        }
        .tab {
          flex: 1;
          padding: 0.65rem 0.5rem;
          min-height: var(--touch-min, 44px);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          background: var(--color-white);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
        }
        .tab.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        @media (min-width: 768px) {
          .filters {
            position: sticky;
            top: 72px;
            height: fit-content;
          }
          .filters-panel {
            padding: 0;
            display: block !important;
          }
        }
      `}</style>
    </aside>
  );
}
