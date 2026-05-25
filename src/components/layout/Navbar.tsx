"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path: string) =>
    pathname === path || pathname.startsWith(path + "/")
      ? "nav-link active"
      : "nav-link";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navContent = (
    <>
      <nav className="nav-links" aria-label="Main">
        <Link href="/jobs" className={linkClass("/jobs")} onClick={() => setMenuOpen(false)}>
          Jobs
        </Link>
        {user && (
          <Link
            href="/dashboard"
            className={linkClass("/dashboard")}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        )}
      </nav>
      <div className="nav-actions">
        {loading ? null : user ? (
          <>
            <span style={{ marginRight: "10px" }} className="user-greeting">Hi, {user.name.split(" ")[0]}</span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: "10px" }} className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/jobs" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-text">Accountant Hub</span>
        </Link>

        <div className="nav-desktop">{navContent}</div>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-overlay"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div id="mobile-nav" className={`nav-mobile ${menuOpen ? "open" : ""}`}>
        <div className="container nav-mobile-inner">{navContent}</div>
      </div>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--color-white);
          border-bottom: 1px solid var(--color-gray-100);
          box-shadow: var(--shadow-sm);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          padding: var(--space-sm) 0;
          min-height: 56px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          z-index: 52;
        }
        .logo-mark {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          color: white;
          display: grid;
          place-items: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .logo-text {
          display: none;
        }
        .nav-desktop {
          display: none;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-lg);
        }
        .nav-desktop :global(.nav-links) {
          display: flex;
          gap: var(--space-lg);
        }
        .nav-desktop .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        :global(.nav-link) {
          font-weight: 500;
          color: var(--color-gray-700);
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
        }
        :global(.nav-link.active) {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
        .user-greeting {
          font-size: 0.9rem;
          color: var(--color-gray-700);
        }
        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--touch-min, 44px);
          height: var(--touch-min, 44px);
          border: none;
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          border-radius: var(--radius-md);
          cursor: pointer;
          z-index: 52;
        }
        .nav-overlay {
          position: fixed;
          inset: 0;
          top: 56px;
          background: rgba(0, 0, 0, 0.4);
          border: none;
          z-index: 49;
          cursor: pointer;
        }
        .nav-mobile {
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          background: var(--color-white);
          border-bottom: 1px solid var(--color-gray-100);
          box-shadow: var(--shadow-md);
          z-index: 51;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.25s ease;
        }
        .nav-mobile.open {
          max-height: calc(100dvh - 56px);
          overflow-y: auto;
          opacity: 1;
        }
        .nav-mobile-inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          padding: var(--space-lg) var(--container-gutter, 1rem) var(--space-xl);
        }
        .nav-mobile :global(.nav-links) {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .nav-mobile :global(.nav-link) {
          display: block;
          padding: var(--space-md);
          font-size: 1.05rem;
          border-bottom: none;
          border-radius: var(--radius-md);
          background: var(--color-bg);
        }
        .nav-mobile :global(.nav-link.active) {
          background: var(--color-primary-light);
        }
        .nav-mobile .nav-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .nav-mobile .nav-actions :global(.btn) {
          width: 100%;
        }
        .nav-mobile .user-greeting {
          text-align: center;
          padding: var(--space-sm) 0;
        }

        @media (min-width: 768px) {
          .logo-text {
            display: inline;
          }
          .menu-toggle,
          .nav-overlay,
          .nav-mobile {
            display: none !important;
          }
          .nav-desktop {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
