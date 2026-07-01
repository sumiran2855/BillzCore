"use client";

/**
 * OnboardingPage — BillzCore
 *
 * dock.cool-inspired redesign:
 * • Near-black canvas (#0A0A0F) with a single restrained purple glow
 * • Oversized wordmark-style headline — no decorative chips
 * • Hero card floats center-right: live Operations Ledger with row-settle
 *   animation, flip badges, and a progress rail
 * • Bento row below the fold: 3 tight feature cards in a grid
 * • All colors from CSS custom properties; dark/light via data-theme
 */

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import Navbar from "@/features/navbar/Navbar";

/* ─── Types & Data ──────────────────────────────────────────────────────── */

type RecordRow = {
  id: string;
  label: string;
  meta: string;
  amount?: string;
  category: "permit" | "invoice" | "visa" | "candidate";
};

const SEED_RECORDS: RecordRow[] = [
  { id: "WP-2291", label: "Work permit",     meta: "D. Alvarez · Expires in 14d",  category: "permit"    },
  { id: "INV-0847", label: "Invoice",         meta: "Meridian Labor Co.",           amount: "$12,400",     category: "invoice"   },
  { id: "VS-1183", label: "Visa renewal",    meta: "S. Okonjo · Expires in 6d",   category: "visa"      },
  { id: "CN-3302", label: "Candidate",        meta: "R. Fontaine · Onboarding",    category: "candidate" },
];

const CATEGORY_ICONS: Record<RecordRow["category"], string> = {
  permit: "📋", invoice: "💰", visa: "🛂", candidate: "👤",
};

/* ─── Stagger hook ──────────────────────────────────────────────────────── */

function useStaggeredSync(rows: RecordRow[], startDelay = 900, gap = 600) {
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    const timers = rows.map((row, i) =>
      setTimeout(() => setSyncedIds((prev) => new Set(prev).add(row.id)), startDelay + i * gap)
    );
    return () => timers.forEach(clearTimeout);
  }, [rows, startDelay, gap]);
  return syncedIds;
}

/* ─── Ledger Row ────────────────────────────────────────────────────────── */

function LedgerRow({ row, synced, delay }: { row: RecordRow; synced: boolean; delay: number }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 opacity-0"
      style={{
        borderBottom: "1px solid var(--bz-row-border)",
        animation: `ledger-row-in 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms forwards`,
      }}
    >
      <span
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[13px]"
        style={{ backgroundColor: "var(--bz-badge-bg)" }}
        aria-hidden="true"
      >
        {CATEGORY_ICONS[row.category]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>
          {row.label}
          {row.amount && (
            <span className="ml-2 font-bold" style={{ color: "var(--bz-indigo)" }}>{row.amount}</span>
          )}
        </p>
        <p
          className="text-[11px] font-medium mt-0.5 truncate"
          style={{ color: "var(--bz-text-4)", fontFamily: "var(--font-mono), monospace" }}
        >
          {row.id} · {row.meta}
        </p>
      </div>

      <span
        className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold transition-all duration-600"
        style={
          synced
            ? { backgroundColor: "rgba(16,185,129,0.14)", color: "#10B981" }
            : { backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }
        }
      >
        <span
          className="h-[5px] w-[5px] rounded-full flex-shrink-0 transition-colors duration-600"
          style={{ backgroundColor: synced ? "#10B981" : "#F59E0B" }}
        />
        {synced ? "synced" : "pending"}
      </span>
    </div>
  );
}

/* ─── Live Ledger Card ──────────────────────────────────────────────────── */

function LiveLedger() {
  const syncedIds = useStaggeredSync(SEED_RECORDS);
  const syncedCount = syncedIds.size;
  const allDone = syncedCount === SEED_RECORDS.length;
  const pct = (syncedCount / SEED_RECORDS.length) * 100;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--bz-card-bg)",
        border: "1px solid var(--bz-card-border)",
        boxShadow: "0 0 0 1px var(--bz-card-border), 0 40px 80px -20px rgba(99,102,241,0.18)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--bz-card-border)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: "var(--bz-text-4)", fontFamily: "var(--font-mono), monospace" }}
        >
          Operations Ledger
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60"
              style={{ backgroundColor: allDone ? "#10B981" : "#F59E0B" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-700"
              style={{ backgroundColor: allDone ? "#10B981" : "#F59E0B" }}
            />
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--bz-text-4)", fontFamily: "var(--font-mono), monospace" }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Rows */}
      <div>
        {SEED_RECORDS.map((row, i) => (
          <LedgerRow key={row.id} row={row} synced={syncedIds.has(row.id)} delay={i * 80} />
        ))}
      </div>

      {/* Footer progress */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderTop: "1px solid var(--bz-card-border)" }}
      >
        <div
          className="h-[3px] flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--bz-badge-bg)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, background: "var(--bz-gradient)" }}
          />
        </div>
        <span
          className="text-[10.5px] font-semibold tabular-nums transition-colors duration-700"
          style={{
            color: allDone ? "#10B981" : "var(--bz-text-4)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          {allDone ? "✓ All synced" : `${syncedCount} / ${SEED_RECORDS.length}`}
        </span>
      </div>
    </div>
  );
}

/* ─── Bento Feature Card ────────────────────────────────────────────────── */

type BentoCardProps = {
  icon: string;
  title: string;
  body: string;
  accent?: string;
  delay?: number;
};

function BentoCard({ icon, title, body, accent, delay = 0 }: BentoCardProps) {
  return (
    <div
      className="group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--bz-card-bg)",
        border: "1px solid var(--bz-card-border)",
        boxShadow: "0 1px 0 0 rgba(255,255,255,0.03) inset",
        animation: `fade-up 0.6s ease ${delay}ms both`,
      }}
    >
      {accent && (
        <div
          className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />
      )}
      <span className="text-2xl mb-3 block" aria-hidden="true">{icon}</span>
      <h3 className="text-[14px] font-semibold mb-1.5" style={{ color: "var(--bz-text-1)" }}>
        {title}
      </h3>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--bz-text-3)" }}>
        {body}
      </p>
    </div>
  );
}

/* ─── Stats Strip ───────────────────────────────────────────────────────── */

const STATS = [
  { value: "2,400+", label: "Teams" },
  { value: "99.9%",  label: "Uptime" },
  { value: "< 1s",   label: "Sync time" },
  { value: "0",      label: "Re-keying" },
];

function StatsStrip() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
      style={{ backgroundColor: "var(--bz-card-border)" }}
    >
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-0.5 py-5 px-4"
          style={{ backgroundColor: "var(--bz-card-bg)" }}
        >
          <span
            className="text-[22px] font-extrabold tracking-[-0.03em]"
            style={{
              background: "var(--bz-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stat.value}
          </span>
          <span className="text-[11px] font-medium" style={{ color: "var(--bz-text-4)" }}>
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Avatar Proof ──────────────────────────────────────────────────────── */

const AVATARS = [
  { initials: "MK", color: "#7C3AED" },
  { initials: "AL", color: "#4F46E5" },
  { initials: "JD", color: "#2563EB" },
  { initials: "SR", color: "#0891B2" },
  { initials: "PF", color: "#059669" },
];

function AvatarProof() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-2">
        {AVATARS.map((a, i) => (
          <span
            key={i}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ backgroundColor: a.color, boxShadow: "0 0 0 2px var(--bz-bg)" }}
            aria-hidden="true"
          >
            {a.initials}
          </span>
        ))}
      </div>
      <span className="text-[12px]" style={{ color: "var(--bz-text-4)" }}>
        <span className="font-semibold" style={{ color: "var(--bz-text-3)" }}>2,400+</span> teams trust BillzCore
      </span>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function OnboardingPage() {
  const { theme } = useTheme();

  return (
    <main
      data-theme={theme}
      className="relative min-h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--bz-bg)" }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ledger-row-in {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
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

      {/* ── Background glow — single restrained orb ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[-120px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full blur-[120px]"
          style={{
            backgroundColor: "var(--bz-orb-a)",
            opacity: 0.4,
            animation: "glow-pulse 8s ease-in-out infinite",
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--bz-dot-color, rgba(99,102,241,0.18)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, var(--bz-bg) 100%)",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-24 pb-16">

        <div className="w-full max-w-[1120px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left copy */}
          <div className="flex flex-col items-start">
            {/* Eyebrow */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-semibold"
              style={{
                backgroundColor: "var(--bz-badge-bg)",
                borderColor: "var(--bz-badge-border)",
                color: "var(--bz-badge-text)",
                animation: "fade-up 0.6s ease 0.05s both",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: "#6366F1" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
              </span>
              Now in beta — join 2,400+ teams
            </div>

            {/* Headline — dock.cool-style: simple, oversized, two-line */}
            <h1
              className="text-[3.25rem] sm:text-[4rem] lg:text-[4.5rem] font-extrabold leading-[1.04] tracking-[-0.04em] mb-5"
              style={{
                color: "var(--bz-text-1)",
                animation: "fade-up 0.65s ease 0.12s both",
              }}
            >
              Every record,<br />
              <span
                style={{
                  background: "var(--bz-gradient-text)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                tracked to synced.
              </span>
            </h1>

            {/* Body */}
            <p
              className="text-[16px] leading-relaxed max-w-[430px] mb-8"
              style={{
                color: "var(--bz-text-3)",
                animation: "fade-up 0.65s ease 0.2s both",
              }}
            >
              Permits, invoices, visas, and candidates — all watched from one
              ledger the moment you sign in. No re-keying. No missed renewals.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-3 mb-8"
              style={{ animation: "fade-up 0.65s ease 0.28s both" }}
            >
              <a
                href="/workspace"
                className="inline-flex h-11 items-center gap-2 rounded-xl px-6 text-[14px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                style={{
                  background: "var(--bz-gradient)",
                  boxShadow: "0 4px 20px -4px var(--bz-shadow-btn)",
                }}
              >
                Get started free
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <a
                href="#features"
                className="inline-flex h-11 items-center gap-2 rounded-xl border px-6 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                style={{
                  borderColor: "var(--bz-border-hard)",
                  color: "var(--bz-text-2)",
                  backgroundColor: "var(--bz-bg-glass)",
                }}
              >
                See how it works
              </a>
            </div>

            {/* Social proof */}
            <div style={{ animation: "fade-up 0.65s ease 0.36s both" }}>
              <AvatarProof />
            </div>
          </div>

          {/* Right — Ledger card */}
          <div
            className="w-full lg:max-w-[420px] lg:ml-auto"
            style={{ animation: "fade-up 0.7s ease 0.2s both" }}
          >
            <LiveLedger />
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="relative z-10 px-4 sm:px-6 pb-14">
        <div
          className="w-full max-w-[1120px] mx-auto"
          style={{ animation: "fade-up 0.65s ease 0.4s both" }}
        >
          <StatsStrip />
        </div>
      </section>

      {/* ── Bento features ── */}
      <section className="relative z-10 px-4 sm:px-6 pb-24" id="features">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="mb-10 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: "var(--bz-text-4)" }}
            >
              What you get
            </p>
            <h2
              className="text-[2rem] sm:text-[2.4rem] font-extrabold tracking-[-0.03em]"
              style={{ color: "var(--bz-text-1)" }}
            >
              One ledger for everything that moves
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <BentoCard
              icon="📋"
              title="Permit & visa tracking"
              body="Expiry alerts surface weeks ahead. Never miss a renewal, never lose a worker to an expired document."
              accent="#6366F1"
              delay={100}
            />
            <BentoCard
              icon="💰"
              title="Invoice reconciliation"
              body="Every invoice lands, settles, and closes in one view. No spreadsheets, no double-entry."
              accent="#8B5CF6"
              delay={180}
            />
            <BentoCard
              icon="👤"
              title="Candidate pipeline"
              body="From first contact to onboarded. Track every stage with a full audit trail behind it."
              accent="#3B82F6"
              delay={260}
            />
            <BentoCard
              icon="🔔"
              title="Smart notifications"
              body="Get notified where you work — email, Slack, or in-app. Zero noise, just signal."
              accent="#10B981"
              delay={340}
            />
            <BentoCard
              icon="📊"
              title="Real-time dashboard"
              body="One pane of glass. Expiring permits, open invoices, and pending hires — all live."
              accent="#F59E0B"
              delay={420}
            />
            <BentoCard
              icon="🔒"
              title="Role-based access"
              body="Control who sees what. Finance sees invoices, HR sees candidates — nothing leaks."
              accent="#6366F1"
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 px-4 sm:px-6 pb-24">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: "var(--bz-text-4)" }}>Pricing</p>
            <h2 className="text-[2rem] sm:text-[2.4rem] font-extrabold tracking-[-0.03em]" style={{ color: "var(--bz-text-1)" }}>Simple, transparent pricing</h2>
            <p className="text-[15px] mt-3 max-w-lg mx-auto" style={{ color: "var(--bz-text-3)" }}>Start free. Scale as your team grows. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Starter", icon: "🌱", price: "Free", color: "#10B981", sub: "Forever free", features: ["1 recruiter seat", "50 candidates", "5 clients", "Basic invoices", "Email support"] },
              { name: "Pro",      icon: "⚡", price: "AED 499", color: "#6366F1", sub: "/month · Most popular", popular: true, features: ["10 seats", "Unlimited candidates", "Unlimited clients", "Quotations & proposals", "Finance dashboard", "Priority support"] },
              { name: "Business", icon: "🚀", price: "AED 999", color: "#8B5CF6", sub: "/month", features: ["30 seats", "Everything in Pro", "Multi-branch", "API access", "Dedicated manager", "SLA support"] },
              { name: "Enterprise", icon: "🏢", price: "Custom", color: "#F59E0B", sub: "Contact sales", features: ["Unlimited seats", "Everything in Business", "White-label", "Custom SLA", "SSO", "Data residency"] },
            ].map(p => (
              <div key={p.name} className="rounded-2xl border flex flex-col overflow-hidden transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--bz-card-bg)", borderColor: p.popular ? p.color : "var(--bz-card-border)", boxShadow: p.popular ? `0 0 0 2px ${p.color}30` : undefined }}>
                <div className="h-1 rounded-t-2xl" style={{ backgroundColor: p.color }} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl">{p.icon}</span>
                      <p className="text-[14px] font-extrabold mt-1" style={{ color: "var(--bz-text-1)" }}>{p.name}</p>
                    </div>
                    {p.popular && <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full" style={{ backgroundColor: p.color, color: "#fff" }}>Popular</span>}
                  </div>
                  <p className="text-[24px] font-extrabold mb-0.5" style={{ color: p.color }}>{p.price}</p>
                  <p className="text-[11px] mb-4" style={{ color: "var(--bz-text-4)" }}>{p.sub}</p>
                  <ul className="space-y-1.5 flex-1 mb-5">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--bz-text-2)" }}>
                        <span style={{ color: p.color }} className="font-bold mt-0.5 shrink-0">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="/workspace" className="block text-center py-2 rounded-xl text-[13px] font-bold transition-all hover:-translate-y-px"
                    style={p.popular ? { background: `linear-gradient(135deg,${p.color},${p.color}cc)`, color: "#fff" } : { border: `1.5px solid ${p.color}`, color: p.color }}>
                    {p.name === "Enterprise" ? "Contact Sales" : "Get started"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS OVERVIEW ── */}
      <section id="integrations" className="relative z-10 px-4 sm:px-6 pb-24">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,#1a3a2a,#1e4535,#163328)", position: "relative" }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 items-center">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span className="h-px w-6 bg-white/30" />INTEGRATIONS
                </p>
                <h2 className="text-[22px] sm:text-[28px] font-extrabold text-white leading-tight mb-4">
                  Connects to the tools your<br />back office already runs.
                </h2>
                <ul className="space-y-2.5 mb-6">
                  {["Neon Postgres + Auth", "PDF invoicing & quotations", "Email & SMS-ready notifications", "Role-based access & audit trail"].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>{f}
                    </li>
                  ))}
                </ul>
                <a href="/workspace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                  View all integrations
                </a>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🐘", name: "Neon Postgres" }, { icon: "🔑", name: "Neon Auth" }, { icon: "💳", name: "Payments" },
                  { icon: "📄", name: "PDF Invoices" }, { icon: "📊", name: "Excel / CSV" }, { icon: "✉️", name: "Email alerts" },
                  { icon: "💬", name: "SMS-ready" }, { icon: "🛡️", name: "RBAC + audit" }, { icon: "☁️", name: "Cloud sync" },
                ].map(i => (
                  <div key={i.name} className="flex flex-col items-center gap-2 py-4 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-2xl">{i.icon}</span>
                    <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: "rgba(255,255,255,0.65)" }}>{i.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCS ── */}
      <section id="docs" className="relative z-10 px-4 sm:px-6 pb-24">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: "var(--bz-text-4)" }}>Documentation</p>
            <h2 className="text-[2rem] sm:text-[2.4rem] font-extrabold tracking-[-0.03em]" style={{ color: "var(--bz-text-1)" }}>Everything you need to get started</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🚀", title: "Quick Start",       desc: "Set up your workspace in under 5 minutes. Invite your team, add your first client, post your first job.",      tag: "5 min read",  color: "#6366F1" },
              { icon: "📋", title: "ATS Guide",         desc: "Learn how to manage candidates from sourcing through onboarding with full pipeline tracking.",                   tag: "12 min read", color: "#10B981" },
              { icon: "💰", title: "Invoice & Finance",  desc: "Generate invoices, track payments, reconcile accounts and export reports for your accountant.",                 tag: "8 min read",  color: "#F59E0B" },
              { icon: "🔗", title: "Integrations API",  desc: "Connect your existing tools via REST API. Full OpenAPI spec, webhooks and sandbox environment.",                tag: "20 min read", color: "#8B5CF6" },
              { icon: "🛡️", title: "Security & RBAC",  desc: "Configure roles, audit logs and access controls to meet your compliance requirements.",                          tag: "10 min read", color: "#EF4444" },
              { icon: "📊", title: "Reports & Analytics",desc: "Build custom reports, schedule weekly digests and track recruiter performance over time.",                      tag: "7 min read",  color: "#06B6D4" },
            ].map(d => (
              <div key={d.title} className="group rounded-2xl border p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--bz-card-bg)", border: "1px solid var(--bz-card-border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: d.color + "14" }}>{d.icon}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bz-badge-bg)", color: "var(--bz-text-4)" }}>{d.tag}</span>
                </div>
                <h3 className="text-[14px] font-bold mb-1.5" style={{ color: "var(--bz-text-1)" }}>{d.title}</h3>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--bz-text-3)" }}>{d.desc}</p>
                <p className="text-[12px] font-semibold mt-3 flex items-center gap-1" style={{ color: d.color }}>Read guide <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHANGELOG ── */}
      <section id="changelog" className="relative z-10 px-4 sm:px-6 pb-24">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: "var(--bz-text-4)" }}>Changelog</p>
            <h2 className="text-[2rem] sm:text-[2.4rem] font-extrabold tracking-[-0.03em]" style={{ color: "var(--bz-text-1)" }}>What's new in BillzCore</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ backgroundColor: "var(--bz-card-border)" }} />
            <div className="space-y-6">
              {[
                { version: "v1.4.0", date: "Jun 20, 2026", tag: "Major",  color: "#6366F1", changes: ["Job Tracker with Kanban board and list view", "3-step job posting wizard with salary ranges", "Pipeline stage transitions with one click", "Mobile-responsive Kanban columns"] },
                { version: "v1.3.0", date: "Jun 10, 2026", tag: "Major",  color: "#8B5CF6", changes: ["Finance dashboard with revenue vs expense charts", "Receivables tracking and aging report", "Transaction ledger with full filtering", "P&L summary card"] },
                { version: "v1.2.2", date: "May 28, 2026", tag: "Patch",  color: "#10B981", changes: ["Fixed TypeScript status comparison bug in Quotations", "Improved mobile nav dropdown behaviour", "Performance improvements on candidate list render"] },
                { version: "v1.2.0", date: "May 15, 2026", tag: "Minor",  color: "#F59E0B", changes: ["Sales Report with daily/weekly/monthly toggle", "Performance Analytics with recruiter scorecards", "Radial SVG metric rings on performance page"] },
                { version: "v1.1.0", date: "May 1, 2026",  tag: "Minor",  color: "#06B6D4", changes: ["Proposals module with 3-step wizard", "Quotation editor with draft → sent → accepted flow", "Client detail page with project history tab"] },
              ].map(log => (
                <div key={log.version} className="flex gap-5 pl-1">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-white text-[10px] font-extrabold"
                    style={{ backgroundColor: log.color, borderColor: "var(--bz-bg)" }}>{log.tag[0]}</div>
                  <div className="flex-1 rounded-2xl border p-5 -mt-0.5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-card-border)" }}>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[13px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{log.version}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: log.color + "18", color: log.color }}>{log.tag}</span>
                      <span className="text-[11px]" style={{ color: "var(--bz-text-4)" }}>{log.date}</span>
                    </div>
                    <ul className="space-y-1">
                      {log.changes.map(c => (
                        <li key={c} className="flex items-start gap-2 text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>
                          <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: log.color }} />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="relative z-10 px-4 sm:px-6 pb-16">
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left */}
              <div className="p-8 sm:p-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: "#6366F1" }}>Contact Us</p>
                <h2 className="text-[22px] sm:text-[28px] font-extrabold tracking-tight mb-3" style={{ color: "var(--bz-text-1)" }}>Talk to our team</h2>
                <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: "var(--bz-text-3)" }}>
                  Whether you're evaluating BillzCore for your agency or need help with a specific workflow — we're here. Average response time: under 2 hours.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: "✉️", label: "Email",   val: "hello@billzcore.io"     },
                    { icon: "💬", label: "WhatsApp", val: "+971 50 123 4567"       },
                    { icon: "📍", label: "Office",   val: "Level 12, Dubai Trade Centre, UAE" },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-3">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--bz-text-4)" }}>{c.label}</p>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{c.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right — form */}
              <div className="p-8 sm:p-12 border-t lg:border-t-0 lg:border-l" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
                <div className="space-y-4">
                  {[{ label: "Full Name", placeholder: "Arjun Kumar", type: "text" }, { label: "Work Email", placeholder: "arjun@company.com", type: "email" }, { label: "Company", placeholder: "Acme Recruitment", type: "text" }].map(f => (
                    <div key={f.label}>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--bz-text-3)" }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder}
                        className="w-full h-10 rounded-xl px-3 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
                        style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--bz-text-3)" }}>Message</label>
                    <textarea rows={3} placeholder="Tell us about your team and what you're looking for…"
                      className="w-full rounded-xl px-3 py-2 text-[13px] outline-none border resize-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
                      style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
                  </div>
                  <button className="w-full h-11 rounded-xl text-[13.5px] font-bold text-white transition-all hover:-translate-y-px"
                    style={{ background: "var(--bz-gradient)", boxShadow: "0 4px 20px -4px var(--bz-shadow-btn)" }}>
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 px-4 sm:px-6 pb-10 pt-4 border-t" style={{ borderColor: "var(--bz-card-border)" }}>
        <div className="w-full max-w-[1120px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-[11px] font-extrabold" style={{ background: "var(--bz-gradient)" }}>BC</span>
                <span className="text-[15px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>BillzCore</span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--bz-text-4)" }}>The all-in-one operations ledger for recruitment agencies.</p>
            </div>
            {[
              { title: "Product",  links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { title: "Docs",     links: ["Quick Start", "API Reference", "Integrations", "Security"] },
              { title: "Company",  links: ["About", "Blog", "Careers", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--bz-text-4)" }}>{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-[13px] transition-opacity hover:opacity-80" style={{ color: "var(--bz-text-3)" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t" style={{ borderColor: "var(--bz-card-border)" }}>
            <p className="text-[12px]" style={{ color: "var(--bz-text-4)" }}>© 2026 BillzCore. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["Privacy", "Terms", "Security"].map(l => (
                <a key={l} href="#" className="text-[12px] hover:opacity-80" style={{ color: "var(--bz-text-4)" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}