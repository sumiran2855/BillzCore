"use client";

/**
 * WorkspacePage — BillzCore
 *
 * Workspace Hub / company selector:
 * • Same design language as LoginPage — orbs, dot-grid, glassmorphism
 * • Simple top bar: BillzCore logo left, Sign out right
 * • Centered frosted-glass card with company list
 * • Click any workspace card → navigate to /dashboard
 */

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";

/* ─── Demo workspaces ───────────────────────────────────────────────────── */

type Workspace = {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  members: number;
};

const WORKSPACES: Workspace[] = [
  {
    id: "meridian",
    name: "Meridian Workforce Solutions",
    role: "Company Admin",
    icon: "M",
    color: "#4F46E5",
    members: 142,
  },
  {
    id: "peak",
    name: "Peak Talent Agency",
    role: "Company Admin",
    icon: "P",
    color: "#7C3AED",
    members: 87,
  },
  {
    id: "crestline",
    name: "Crestline Staffing Group",
    role: "HR Manager",
    icon: "C",
    color: "#2563EB",
    members: 214,
  },
];

/* ─── WorkspaceCard ─────────────────────────────────────────────────────── */

function WorkspaceCard({
  workspace,
  onSelect,
  loading,
}: {
  workspace: Workspace;
  onSelect: (id: string) => void;
  loading: string | null;
}) {
  const isLoading = loading === workspace.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(workspace.id)}
      disabled={loading !== null}
      className="group w-full flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] disabled:cursor-wait"
      style={{
        backgroundColor: "var(--bz-card-bg)",
        borderColor: "var(--bz-card-border)",
        boxShadow: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--bz-border)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 20px -4px rgba(99,102,241,0.18), 0 1px 0 0 rgba(255,255,255,0.03) inset";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--bz-card-border)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 1px 0 0 rgba(255,255,255,0.03) inset";
      }}
    >
      {/* Logo avatar */}
      <span
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white"
        style={{ background: workspace.color }}
      >
        {workspace.icon}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-semibold truncate"
          style={{ color: "var(--bz-text-1)" }}
        >
          {workspace.name}
        </p>
        <p className="flex items-center gap-1.5 mt-0.5 text-[12px]" style={{ color: "var(--bz-text-4)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {workspace.role}
          <span style={{ color: "var(--bz-text-4)", opacity: 0.5 }}>·</span>
          <span style={{ fontFamily: "var(--font-mono), monospace" }}>{workspace.members} members</span>
        </p>
      </div>

      {/* Arrow / spinner */}
      <span
        className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 group-hover:translate-x-0.5"
        style={{ color: "var(--bz-text-4)" }}
      >
        {isLoading ? (
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function WorkspacePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSelect(id: string) {
    setLoading(id);
    // Simulate workspace load
    await new Promise((r) => setTimeout(r, 700));
    router.push("/dashboard");
  }

  return (
    <main
      data-theme={theme}
      className="relative h-screen overflow-hidden transition-colors duration-300 flex flex-col"
      style={{ backgroundColor: "var(--bz-bg)" }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── Background orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ backgroundColor: "var(--bz-orb-a)", opacity: 0.35, animation: "glow-pulse 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] h-[340px] w-[340px] rounded-full blur-[90px]"
          style={{ backgroundColor: "var(--bz-orb-b)", opacity: 0.22, animation: "glow-pulse 11s ease-in-out 3s infinite" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--bz-dot-color, rgba(99,102,241,0.18)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, var(--bz-bg) 100%)" }}
        />
      </div>

      {/* ── Top bar ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--bz-border-hard)" }}
      >
        {/* Logo */}
        <a
          href="/"
          aria-label="BillzCore home"
          className="group flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-lg"
        >
          <span
            className="relative flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-105"
            style={{ background: "var(--bz-gradient)" }}
          >
            <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5.5 4H11C12.933 4 14.5 5.567 14.5 7.5C14.5 8.46 14.107 9.327 13.467 9.957C14.107 10.587 14.5 11.454 14.5 12.5C14.5 14.433 12.933 16 11 16H5.5V4Z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
              <line x1="5.5" y1="10" x2="13.2" y2="10" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="flex items-baseline leading-none">
            <span className="text-[14.5px] font-bold tracking-[-0.02em]" style={{ color: "var(--bz-text-1)" }}>Billz</span>
            <span
              className="text-[14.5px] font-bold tracking-[-0.02em]"
              style={{ background: "var(--bz-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >Core</span>
          </span>
        </a>

        {/* Sign out */}
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          style={{
            borderColor: "var(--bz-border-hard)",
            backgroundColor: "var(--bz-card-bg)",
            color: "var(--bz-text-3)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-1)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-3)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </a>
      </header>

      {/* ── Center content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[520px] flex flex-col gap-8"
          style={{ animation: "fade-up 0.6s ease 0.05s both" }}
        >
          {/* Hero text */}
          <div className="text-center flex flex-col gap-2">
            {/* Eyebrow */}
            <p
              className="text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--bz-badge-text)" }}
            >
              Workspace Hub
            </p>

            {/* Headline */}
            <h1
              className="text-[2.4rem] font-extrabold tracking-[-0.035em] leading-tight"
              style={{ color: "var(--bz-text-1)" }}
            >
              Welcome,{" "}
              <span
                style={{
                  background: "var(--bz-gradient-text)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Alex Fontaine
              </span>
            </h1>

            <p className="text-[14px]" style={{ color: "var(--bz-text-3)" }}>
              Select an agency workspace to continue.
            </p>
          </div>

          {/* Workspace list */}
          <div className="flex flex-col gap-3">
            {WORKSPACES.map((ws, i) => (
              <div
                key={ws.id}
                style={{ animation: `fade-up 0.55s ease ${0.1 + i * 0.08}s both` }}
              >
                <WorkspaceCard
                  workspace={ws}
                  onSelect={handleSelect}
                  loading={loading}
                />
              </div>
            ))}
          </div>

          {/* Footer nudge */}
          <p className="text-center text-[12px]" style={{ color: "var(--bz-text-4)" }}>
            Don&apos;t see your workspace?{" "}
            <a
              href="/login"
              className="font-semibold transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none"
              style={{ color: "var(--bz-badge-text)" }}
            >
              Sign in with a different account
            </a>
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 shrink-0 py-4 text-center">
        <p className="text-[11px]" style={{ color: "var(--bz-text-4)" }}>
          © 2026 BillzCore. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
