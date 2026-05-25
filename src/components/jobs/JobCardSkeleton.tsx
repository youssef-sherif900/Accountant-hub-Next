export function JobCardSkeleton() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton" style={{ height: 24, width: "70%" }} />
      <div className="skeleton" style={{ height: 16, width: "40%", marginTop: 12 }} />
      <div className="skeleton" style={{ height: 48, width: "100%", marginTop: 12 }} />
      <div className="skeleton" style={{ height: 16, width: "55%", marginTop: 16 }} />
      <style jsx>{`
        .skeleton-card {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
      `}</style>
    </div>
  );
}
