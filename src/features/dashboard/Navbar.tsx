"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";

interface NavbarProps {
  onMenuClick: () => void;
}

const notifs = [
  { id: 1, icon: "💼", title: "New candidate applied", sub: "React Developer · 2m ago", unread: true },
  { id: 2, icon: "🧾", title: "Invoice #INV-0042 paid", sub: "Acme Corp · 14m ago", unread: true },
  { id: 3, icon: "📋", title: "Proposal accepted", sub: "TechStart Ltd · 1h ago", unread: false },
  { id: 4, icon: "⚠️", title: "Action required on deal", sub: "Globex Inc · 3h ago", unread: false },
];

export default function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <header
      className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 h-14 border-b shrink-0"
      style={{
        backgroundColor: "var(--bz-navbar-bg, var(--bz-card-bg))",
        borderColor: "var(--bz-border-hard)",
      }}
    >
      {/* Hamburger / menu button for mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-colors hover:bg-[rgba(99,102,241,0.08)]"
        style={{ color: "var(--bz-text-2)" }}
        aria-label="Toggle sidebar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Search */}
      <div className="relative hidden sm:flex flex-1 max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--bz-text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search candidates, clients, invoices…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-8 rounded-lg pl-8 pr-3 text-[12.5px] outline-none transition-all"
          style={{
            backgroundColor: "var(--bz-input-bg, var(--bz-bg))",
            border: "1px solid var(--bz-border-hard)",
            color: "var(--bz-text-1)",
          }}
        />
        <kbd
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] px-1 rounded"
          style={{
            backgroundColor: "var(--bz-badge-bg)",
            color: "var(--bz-text-3)",
            border: "1px solid var(--bz-border-hard)",
          }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => toggleTheme()}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]"
          style={{ color: "var(--bz-text-2)" }}
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]"
            style={{ color: "var(--bz-text-2)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: "#6366F1" }}>
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-10 z-50 w-72 sm:w-80 rounded-xl border shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--bz-card-bg)",
                borderColor: "var(--bz-border-hard)",
                maxWidth: "calc(100vw - 16px)",
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>Notifications</span>
                <button className="text-[11px] font-medium" style={{ color: "#6366F1" }}>Mark all read</button>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--bz-border-hard)" }}>
                {notifs.map(n => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[rgba(99,102,241,0.04)] cursor-pointer"
                  >
                    <span className="mt-0.5 text-base shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium truncate" style={{ color: "var(--bz-text-1)" }}>{n.title}</p>
                      <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{n.sub}</p>
                    </div>
                    {n.unread && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#6366F1] shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: "var(--bz-border-hard)" }}>
                <button className="text-[12px] font-medium" style={{ color: "#6366F1" }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Divider — hidden on mobile */}
        <div className="hidden sm:block w-px h-5 mx-1" style={{ backgroundColor: "var(--bz-border-hard)" }} />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            className="flex items-center gap-1.5 rounded-lg px-1.5 sm:px-2 py-1.5 transition-colors hover:bg-[rgba(99,102,241,0.08)]"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-white text-[11px] font-bold shrink-0"
              style={{ background: "var(--bz-gradient)" }}
            >
              AK
            </span>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-semibold leading-none" style={{ color: "var(--bz-text-1)" }}>Arjun K.</p>
              <p className="text-[10.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Admin</p>
            </div>
            <svg className="hidden sm:block" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-11 z-50 w-52 rounded-xl border shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--bz-card-bg)",
                borderColor: "var(--bz-border-hard)",
                maxWidth: "calc(100vw - 16px)",
              }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
                <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>Arjun Kumar</p>
                <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>arjun@billzcore.io</p>
              </div>
              {[
                { icon: "👤", label: "My Profile",    href: "/dashboard/profile"  },
                { icon: "⚙️", label: "Settings",      href: "/dashboard/settings" },
                { icon: "💳", label: "Subscription",  href: "/dashboard/billing"  },
                { icon: "📊", label: "Billing",        href: "/dashboard/finance"  },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[12.5px] transition-colors hover:bg-[rgba(99,102,241,0.06)]"
                  style={{ color: "var(--bz-text-2)" }}
                >
                  <span>{item.icon}</span> {item.label}
                </Link>
              ))}
              <div className="border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                <Link
                  href="/"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[12.5px] transition-colors hover:bg-red-50 text-left"
                  style={{ color: "#EF4444" }}
                >
                  <span>🚪</span> Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}