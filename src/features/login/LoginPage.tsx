"use client";

/**
 * LoginPage — BillzCore
 *
 * Two-column, no-scroll layout:
 * • Left  — marketing copy, feature highlights, social proof
 * • Right — frosted-glass card with passcode flow
 *           (email → Send Passcode → enter code → Sign In)
 *
 * Matches the OnboardingPage design language exactly:
 * same orbs, dot-grid, CSS custom properties, fade-up animations.
 */

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Step = "email" | "code";

/* ─── Reusable Field ────────────────────────────────────────────────────── */

function Field({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12.5px] font-semibold"
        style={{ color: "var(--bz-text-2)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="w-full rounded-xl border px-4 py-2.5 text-[13.5px] outline-none transition-all duration-150 placeholder:opacity-40 focus:ring-2 focus:ring-[#6366F1]/40"
        style={{
          borderColor: "var(--bz-border-hard)",
          backgroundColor: "var(--bz-bg-elevated)",
          color: "var(--bz-text-1)",
        }}
      />
    </div>
  );
}

/* ─── Feature bullet ────────────────────────────────────────────────────── */

function Bullet({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[13px]"
        style={{ backgroundColor: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.25)" }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="text-[13px] leading-relaxed pt-0.5" style={{ color: "rgba(200,200,230,0.75)" }}>
        {text}
      </p>
    </div>
  );
}

/* ─── Avatar strip ──────────────────────────────────────────────────────── */

const AVATARS = [
  { initials: "MK", color: "#7C3AED" },
  { initials: "AL", color: "#4F46E5" },
  { initials: "JD", color: "#2563EB" },
  { initials: "SR", color: "#0891B2" },
];

function AvatarStrip() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex -space-x-2">
        {AVATARS.map((a, i) => (
          <span
            key={i}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ backgroundColor: a.color, boxShadow: "0 0 0 2px rgba(13,5,32,0.8)" }}
            aria-hidden="true"
          >
            {a.initials}
          </span>
        ))}
      </div>
      <span className="text-[12px]" style={{ color: "rgba(180,180,210,0.6)" }}>
        <span className="font-semibold" style={{ color: "rgba(200,200,230,0.85)" }}>2,400+</span>{" "}
        teams trust BillzCore
      </span>
    </div>
  );
}

/* ─── Logo mark ─────────────────────────────────────────────────────────── */

function LogoMark({ size = "sm", forceLight = false }: { size?: "sm" | "lg"; forceLight?: boolean }) {
  const iconDim = size === "lg" ? 18 : 15;
  return (
    <a
      href="/"
      aria-label="BillzCore home"
      className="group flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-lg shrink-0"
    >
      <span
        className="relative flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-105"
        style={{
          background: "var(--bz-gradient)",
          height: size === "lg" ? "2.5rem" : "1.75rem",
          width: size === "lg" ? "2.5rem" : "1.75rem",
        }}
      >
        <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <svg width={iconDim} height={iconDim} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M5.5 4H11C12.933 4 14.5 5.567 14.5 7.5C14.5 8.46 14.107 9.327 13.467 9.957C14.107 10.587 14.5 11.454 14.5 12.5C14.5 14.433 12.933 16 11 16H5.5V4Z"
            stroke="white"
            strokeWidth="1.7"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="5.5" y1="10" x2="13.2" y2="10" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex items-baseline leading-none">
        <span
          className="font-bold tracking-[-0.02em]"
          style={{
            color: forceLight ? "#FFFFFF" : "var(--bz-text-1)",
            fontSize: size === "lg" ? "18px" : "14.5px",
          }}
        >
          Billz
        </span>
        <span
          className="font-bold tracking-[-0.02em]"
          style={{
            background: "var(--bz-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: size === "lg" ? "18px" : "14.5px",
          }}
        >
          Core
        </span>
      </span>
    </a>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const { theme } = useTheme();

  // Passcode flow state
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setCodeSent(true);
    setStep("code");
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    // TODO: verify passcode via API
    console.log("Sign in with passcode", { email, code });
  }

  function handleChangeEmail() {
    setStep("email");
    setCode("");
    setCodeSent(false);
  }

  return (
    <main
      data-theme={theme}
      className="relative h-screen overflow-hidden transition-colors duration-300 flex"
      style={{ backgroundColor: "var(--bz-bg)" }}
    >
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.08); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>



      {/* ── Background orbs (same as landing) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[-120px] left-1/4 -translate-x-1/2 h-[600px] w-[600px] rounded-full blur-[130px]"
          style={{
            backgroundColor: "var(--bz-orb-a)",
            opacity: 0.4,
            animation: "glow-pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-60px] right-[-80px] h-[400px] w-[400px] rounded-full blur-[100px]"
          style={{
            backgroundColor: "var(--bz-orb-b)",
            opacity: 0.28,
            animation: "glow-pulse 10s ease-in-out 2s infinite",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--bz-dot-color, rgba(99,102,241,0.18)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, var(--bz-bg) 100%)",
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════
          LEFT — Marketing panel
          ════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] h-full px-14 py-10 relative z-10 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0D0520 0%, #110836 35%, #0F1847 65%, #091030 100%)",
          borderRight: "1px solid rgba(99,102,241,0.2)",
          animation: "fade-up 0.65s ease 0.05s both",
        }}
      >
        {/* Inner ambient orbs — decorative only */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Top-right violet bloom */}
          <div
            className="absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 70%)", animation: "glow-pulse 9s ease-in-out infinite" }}
          />
          {/* Bottom-left blue bloom */}
          <div
            className="absolute -bottom-24 -left-16 h-[360px] w-[360px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)", animation: "glow-pulse 11s ease-in-out 3s infinite" }}
          />
          {/* Subtle mesh grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.2) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.6,
            }}
          />
          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }}
          />
        </div>
        {/* Top: logo — forced light text so it reads on the dark gradient background */}
        <LogoMark size="sm" forceLight />

        {/* Middle: hero copy */}
        <div className="flex flex-col gap-8 max-w-[480px]">
          {/* Eyebrow badge */}
          <div
            className="self-start inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-semibold"
            style={{
              backgroundColor: "rgba(139,92,246,0.15)",
              borderColor: "rgba(139,92,246,0.3)",
              color: "#C4B5FD",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60"
                style={{ backgroundColor: "#818CF8" }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#818CF8]" />
            </span>
            Now in beta — join 2,400+ teams
          </div>

          {/* Headline */}
          <h1
            className="text-[3rem] font-extrabold leading-[1.06] tracking-[-0.04em]"
            style={{ color: "#EEEEFF" }}
          >
            Every record,
            <br />
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
            className="text-[15px] leading-relaxed"
            style={{ color: "rgba(200,200,230,0.75)" }}
          >
            Permits, invoices, visas, and candidates — all watched from one
            ledger the moment you sign in. No re-keying. No missed renewals.
          </p>

          {/* Feature bullets */}
          <div className="flex flex-col gap-3.5">
            <Bullet icon="📋" text="Permit & visa expiry alerts surface weeks ahead — never lose a worker." />
            <Bullet icon="💰" text="Every invoice lands, settles, and closes in one view. No spreadsheets." />
            <Bullet icon="🔔" text="Smart notifications via email, Slack, or in-app. Zero noise, just signal." />
            <Bullet icon="🔒" text="Role-based access — finance sees invoices, HR sees candidates." />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 flex-wrap">
            {[
              { value: "2,400+", label: "Teams" },
              { value: "99.9%", label: "Uptime" },
              { value: "< 1s", label: "Sync time" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span
                  className="text-[22px] font-extrabold tracking-[-0.03em]"
                  style={{
                    background: "var(--bz-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </span>
                <span className="text-[11px] font-medium" style={{ color: "rgba(180,180,210,0.6)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: social proof */}
        <AvatarStrip />
      </div>

      {/* Vertical divider — hidden; left panel already has borderRight */}
      <div className="hidden" aria-hidden="true" />

      {/* ════════════════════════════════════════════════════════
          RIGHT — Login panel
          ════════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col items-center justify-center flex-1 h-full px-6 sm:px-12 relative z-10 overflow-hidden"
        style={{ animation: "fade-up 0.7s ease 0.15s both" }}
      >
        {/* ── Mobile header bar: back button left + logo centered ── */}
        <div className="lg:hidden absolute top-0 left-0 right-0 flex items-center px-5 py-4 z-30"
          style={{ borderBottom: "1px solid var(--bz-border-hard)" }}
        >
          {/* Back arrow — left */}
          <a
            href="/onboarding"
            aria-label="Back to landing page"
            className="flex items-center justify-center h-9 w-9 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            style={{
              borderColor: "var(--bz-border-hard)",
              backgroundColor: "var(--bz-card-bg)",
              color: "var(--bz-text-2)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M10 6H2M5 3L2 6L5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Logo — centered absolutely so it doesn't depend on button width */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <LogoMark size="sm" />
          </div>

          {/* Right spacer — keeps logo visually centered */}
          <div className="ml-auto h-9 w-9" aria-hidden="true" />
        </div>

        {/* ── Desktop back button — absolutely pinned to top-left of right panel ── */}
        <a
          href="/onboarding"
          aria-label="Back to landing page"
          className="hidden lg:inline-flex absolute top-5 left-6 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12.5px] font-semibold z-30 transition-all duration-200 hover:-translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          style={{
            borderColor: "var(--bz-border)",
            backgroundColor: "var(--bz-card-bg)",
            color: "var(--bz-text-2)",
            boxShadow: "0 1px 6px -1px rgba(0,0,0,0.12), 0 0 0 1px var(--bz-border)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-1)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--bz-badge-border)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-2)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--bz-border)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M10 6H2M5 3L2 6L5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to home
        </a>

        {/* Right panel content — constrained width */}
        <div className="w-full max-w-[390px] flex flex-col gap-6 mt-[4.5rem] lg:mt-0">

          {/* Heading */}
          <div className="text-center lg:text-left">
            <h2
              className="text-[1.75rem] font-extrabold tracking-[-0.035em] leading-tight"
              style={{ color: "var(--bz-text-1)" }}
            >
              Welcome back
            </h2>
            <p className="mt-1.5 text-[13.5px]" style={{ color: "var(--bz-text-3)" }}>
              Sign in to your{" "}
              <span
                style={{
                  background: "var(--bz-gradient-text)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 600,
                }}
              >
                BillzCore
              </span>{" "}
              account
            </p>
          </div>

          {/* ── Glass card ── */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{
              backgroundColor: "var(--bz-card-bg)",
              border: "1px solid var(--bz-card-border)",
              boxShadow:
                "0 0 0 1px var(--bz-card-border), 0 32px 64px -16px rgba(99,102,241,0.18), 0 1px 0 0 rgba(255,255,255,0.04) inset",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* ── STEP 1: Email + Send Passcode ── */}
            {step === "email" && (
              <form
                key="email-step"
                onSubmit={handleSendCode}
                className="flex flex-col gap-4"
                noValidate
                style={{ animation: "fade-in 0.3s ease both" }}
              >
                <Field
                  id="login-email"
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />

                <button
                  id="send-passcode-btn"
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{
                    background: "var(--bz-gradient)",
                    boxShadow: "0 4px 20px -4px var(--bz-shadow-btn)",
                  }}
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Passcode
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-[11.5px]" style={{ color: "var(--bz-text-4)" }}>
                  We&apos;ll email you a one-time 6-digit code. No password needed.
                </p>
              </form>
            )}

            {/* ── STEP 2: Enter Code + Sign In ── */}
            {step === "code" && (
              <form
                key="code-step"
                onSubmit={handleSignIn}
                className="flex flex-col gap-4"
                noValidate
                style={{ animation: "slide-in 0.35s ease both" }}
              >
                {/* Email chip — click to change */}
                <div
                  className="flex items-center justify-between rounded-xl border px-4 py-2.5"
                  style={{
                    borderColor: "var(--bz-border-hard)",
                    backgroundColor: "var(--bz-bg-elevated)",
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ color: "var(--bz-text-3)", flexShrink: 0 }}
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{ color: "var(--bz-text-2)" }}
                    >
                      {email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-[11.5px] font-semibold ml-2 shrink-0 transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none"
                    style={{ color: "var(--bz-badge-text)" }}
                  >
                    Change
                  </button>
                </div>

                <Field
                  id="login-code"
                  label="6-digit passcode"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
                  autoComplete="one-time-code"
                  maxLength={6}
                />

                <p className="text-[11.5px]" style={{ color: "var(--bz-text-4)" }}>
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="font-semibold transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none"
                    style={{ color: "var(--bz-badge-text)" }}
                  >
                    Resend code
                  </button>
                </p>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={code.length < 6}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{
                    background: "var(--bz-gradient)",
                    boxShadow: "0 4px 20px -4px var(--bz-shadow-btn)",
                  }}
                >
                  Sign in
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <span className="flex-1 h-px" style={{ backgroundColor: "var(--bz-border-hard)" }} />
              <span className="text-[11px] font-medium shrink-0" style={{ color: "var(--bz-text-4)" }}>
                or
              </span>
              <span className="flex-1 h-px" style={{ backgroundColor: "var(--bz-border-hard)" }} />
            </div>

            {/* Try demo workshop */}
            <a
              id="try-demo-btn"
              href="/workspace"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold transition-all duration-150 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              style={{
                borderColor: "var(--bz-border-hard)",
                backgroundColor: "var(--bz-bg-glass)",
                color: "var(--bz-text-2)",
                backdropFilter: "blur(12px)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Try Demo Workshop
            </a>
          </div>

          {/* Sign-up nudge */}
          <p className="text-center text-[12.5px]" style={{ color: "var(--bz-text-4)" }}>
            Don&apos;t have an account?{" "}
            <a
              href="/onboarding"
              className="font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded"
              style={{ color: "var(--bz-badge-text)" }}
            >
              Get started free →
            </a>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {["SOC 2", "GDPR", "256-bit TLS"].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ color: "var(--bz-text-4)" }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M6 1l1.09 3.26H10.5L7.7 6.34l1.09 3.26L6 7.52 3.21 9.6l1.09-3.26L1.5 4.26H4.91L6 1z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
