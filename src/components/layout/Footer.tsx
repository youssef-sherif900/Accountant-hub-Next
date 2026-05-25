"use client";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Accountant Hub — Accounting jobs marketplace</p>
      </div>
      <style jsx>{`
        .footer {
          margin-top: auto;
          padding: var(--space-lg) 0;
          padding-bottom: max(var(--space-lg), env(safe-area-inset-bottom));
          background: var(--color-dark);
          color: var(--color-gray-300);
          font-size: 0.85rem;
          text-align: center;
        }
        .footer p {
          margin: 0;
          line-height: 1.5;
          padding: 0 var(--space-sm);
        }
        @media (min-width: 768px) {
          .footer {
            padding: var(--space-xl) 0;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </footer>
  );
}
