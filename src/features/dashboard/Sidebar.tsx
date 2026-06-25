"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const navSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <Icon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>,
      },
    ],
  },
  {
    title: "Workforce",
    items: [
      {
        label: "Candidates",
        href: "/dashboard/candidates",
        icon: <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
        badge: "ATS",
      },
      {
        label: "Clients",
        href: "/dashboard/clients",
        icon: <Icon><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon>,
        badge: "CRM",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Invoices",
        href: "/dashboard/invoices",
        icon: <Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></Icon>,
      },
      {
        label: "Quotations",
        href: "/dashboard/quotations",
        icon: <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>,
      },
      {
        label: "Proposals",
        href: "/dashboard/proposals",
        icon: <Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /></Icon>,
      },
      {
        label: "Finance",
        href: "/dashboard/finance",
        icon: <Icon><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "Sales Report",
        href: "/dashboard/sales",
        icon: <Icon><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>,
        badge: "Revenue",
      },
      {
        label: "Performance",
        href: "/dashboard/performance",
        icon: <Icon><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></Icon>,
      },
      {
        label: "Job Tracking",
        href: "/dashboard/jobs",
        icon: <Icon><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Integrations",
        href: "/dashboard/integrations",
        icon: <Icon><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></Icon>,
        badge: "New",
      },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="relative flex flex-col h-full border-r transition-all duration-300 shrink-0"
      style={{
        width: collapsed ? "64px" : "240px",
        backgroundColor: "var(--bz-sidebar-bg, var(--bz-card-bg))",
        borderColor: "var(--bz-border-hard)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-14 border-b shrink-0"
        style={{ borderColor: "var(--bz-border-hard)" }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--bz-gradient)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </span>
        {!collapsed && (
          <span className="text-[15px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>
            BillzCore
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.title && !collapsed && (
              <p
                className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--bz-text-3)" }}
              >
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium transition-all duration-150 group relative"
                    style={{
                      backgroundColor: active ? "var(--bz-nav-active-bg, rgba(99,102,241,0.12))" : "transparent",
                      color: active ? "#6366F1" : "var(--bz-text-2)",
                    }}
                  >
                    <span className={`shrink-0 transition-colors ${active ? "text-[#6366F1]" : "group-hover:text-[#6366F1]"}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-[9.5px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "#6366F1" }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {active && (
                      <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-l-full"
                        style={{ backgroundColor: "#6366F1" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-8 rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]"
          style={{ color: "var(--bz-text-3)" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {collapsed
              ? <><polyline points="9 18 15 12 9 6" /></>
              : <><polyline points="15 18 9 12 15 6" /></>
            }
          </svg>
          {!collapsed && <span className="ml-2 text-[12px]">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}