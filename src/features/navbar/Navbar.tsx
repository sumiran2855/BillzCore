"use client";

/**
 * Navbar — BillzCore
 *
 * dock.cool-inspired design: ultra-minimal centered pill floating above
 * a near-black canvas. Translucent frosted glass on scroll, sharp border
 * at rest. No conic gradients — just precision: a single indigo dot
 * active indicator, clean hover color shifts, and a morphing burger.
 *
 * Reads CSS custom properties from globals.css.
 */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#docs", label: "Docs" },
  { href: "#changelog", label: "Changelog" },
];

/* ─── Logo ──────────────────────────────────────────────────────────────── */

function Logo() {
  return (
    <a
      href="/"
      aria-label="BillzCore home"
      className="group flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-lg shrink-0"
    >
      <span
        className="relative flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-105"
        style={{ background: "var(--bz-gradient)" }}
      >
        <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
          className="text-[14.5px] font-bold tracking-[-0.02em]"
          style={{ color: "var(--bz-text-1)" }}
        >
          Billz
        </span>
        <span
          className="text-[14.5px] font-bold tracking-[-0.02em]"
          style={{
            background: "var(--bz-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Core
        </span>
      </span>
    </a>
  );
}

/* ─── Desktop Nav ───────────────────────────────────────────────────────── */

function DesktopNav() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <nav
      className="hidden md:flex items-center gap-0.5"
      aria-label="Site navigation"
    >
      {LINKS.map((link, idx) => {
        const isActive = activeIdx === idx;
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setActiveIdx(idx)}
            className="relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            style={{
              color: isActive ? "var(--bz-text-1)" : "var(--bz-text-3)",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--bz-text-2)";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--bz-text-3)";
            }}
          >
            {link.label}
            {isActive && (
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-[3px] h-[3px] w-[3px] rounded-full"
                style={{ background: "var(--bz-gradient)" }}
                aria-hidden="true"
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}

/* ─── Theme Toggle ──────────────────────────────────────────────────────── */

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
      style={{ color: "var(--bz-text-3)" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "var(--bz-text-1)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "var(--bz-text-3)")
      }
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
        }}
        aria-hidden="true"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
        }}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      </span>
    </button>
  );
}

/* ─── Menu Button ───────────────────────────────────────────────────────── */

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="md:hidden relative flex h-8 w-8 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
      style={{ color: "var(--bz-text-2)" }}
    >
      <span className="relative flex h-3.5 w-[18px] flex-col justify-between">
        <span
          className="block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 origin-center"
          style={{ transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }}
        />
        <span
          className="block h-[1.5px] w-full rounded-full bg-current transition-all duration-200"
          style={{ opacity: open ? 0 : 1 }}
        />
        <span
          className="block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 origin-center"
          style={{ transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
        />
      </span>
    </button>
  );
}

/* ─── Mobile Sheet ──────────────────────────────────────────────────────── */

function MobileSheet({ open }: { open: boolean }) {
  return (
    <div
      className="md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
      style={{ maxHeight: open ? 380 : 0, opacity: open ? 1 : 0 }}
    >
      <div
        className="mt-2 rounded-2xl border p-2 flex flex-col gap-0.5"
        style={{
          borderColor: "var(--bz-border-hard)",
          backgroundColor: "var(--bz-nav-bg)",
          backdropFilter: "blur(24px)",
        }}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors duration-150"
            style={{ color: "var(--bz-text-2)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-2)")
            }
          >
            {link.label}
          </a>
        ))}

        <span
          className="my-1 h-px w-full"
          style={{ backgroundColor: "var(--bz-border-hard)" }}
          aria-hidden="true"
        />

        <a
          href="/login"
          className="px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium"
          style={{ color: "var(--bz-text-2)" }}
        >
          Log in
        </a>
        <a
          href="#demo"
          className="mt-1 inline-flex h-10 items-center justify-center rounded-xl text-[13.5px] font-semibold text-white"
          style={{ background: "var(--bz-gradient)" }}
        >
          Get started free
        </a>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 12); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-6 pt-4">
      <div className="w-full max-w-[1120px]">
        {/* Pill container */}
        <div
          className="flex h-12 items-center gap-2 rounded-2xl px-3 sm:px-4 transition-all duration-300"
          style={{
            backgroundColor: scrolled ? "var(--bz-nav-bg-solid)" : "var(--bz-nav-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--bz-border-hard)",
            boxShadow: scrolled
              ? "0 4px 24px -4px rgba(0,0,0,0.28), 0 1px 0 0 rgba(255,255,255,0.04) inset"
              : "none",
          }}
        >
          {/* Logo */}
          <Logo />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Center nav */}
          <DesktopNav />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href="/login"
              className="hidden lg:inline-flex h-8 items-center px-3 rounded-lg text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              style={{ color: "var(--bz-text-3)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--bz-text-3)")
              }
            >
              Log in
            </a>

            <a
              href="/workspace"
              className="hidden sm:inline-flex h-8 items-center gap-1.5 px-3.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              style={{
                background: "var(--bz-gradient)",
                boxShadow: "0 2px 12px -2px var(--bz-shadow-btn)",
              }}
            >
              Get started
            </a>

            <span
              className="hidden sm:block w-px h-4 mx-1"
              style={{ backgroundColor: "var(--bz-border-hard)" }}
              aria-hidden="true"
            />

            <ThemeToggle />
            <MenuButton open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
          </div>
        </div>

        <MobileSheet open={mobileOpen} />
      </div>
    </header>
  );
}