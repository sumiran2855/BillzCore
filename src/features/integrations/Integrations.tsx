"use client";
import { useState } from "react";

type Status = "connected" | "disconnected" | "coming_soon";
type Category = "all" | "database" | "communication" | "finance" | "productivity" | "security";

interface Integration {
  id: string;
  name: string;
  desc: string;
  category: Category;
  icon: string;
  color: string;
  status: Status;
  docs?: string;
  connectedSince?: string;
  features: string[];
}

const INTEGRATIONS: Integration[] = [
  { id: "neon-postgres",  name: "Neon Postgres",    desc: "Serverless Postgres database. All BillzCore data lives here — candidates, invoices, clients.",    category: "database",       icon: "🐘", color: "#10B981", status: "connected",    connectedSince: "Jan 2026", features: ["Real-time sync", "Auto backups", "Branching"] },
  { id: "neon-auth",      name: "Neon Auth",         desc: "Authentication layer for your workspace. Manage SSO, tokens and session control.",                 category: "security",       icon: "🔑", color: "#6366F1", status: "connected",    connectedSince: "Jan 2026", features: ["SSO ready", "JWT tokens", "Role sync"] },
  { id: "stripe",         name: "Stripe Payments",   desc: "Accept subscription payments from clients. Auto-reconcile invoices on payment.",                   category: "finance",        icon: "💳", color: "#635BFF", status: "connected",    connectedSince: "Feb 2026", features: ["Auto invoicing", "Webhooks", "Refunds"] },
  { id: "pdf",            name: "PDF Engine",        desc: "Generate branded PDF invoices, quotations and proposals in one click.",                            category: "productivity",   icon: "📄", color: "#F59E0B", status: "connected",    connectedSince: "Jan 2026", features: ["Custom templates", "Bulk export", "Watermark"] },
  { id: "excel",          name: "Excel / CSV",       desc: "Export candidates, clients, invoices to Excel or CSV for offline analysis.",                       category: "productivity",   icon: "📊", color: "#217346", status: "connected",    connectedSince: "Mar 2026", features: ["Bulk export", "Filtered export", "Custom columns"] },
  { id: "email",          name: "Email Alerts",      desc: "SMTP-based email notifications for placements, invoice due dates and pipeline updates.",           category: "communication",  icon: "✉️", color: "#06B6D4", status: "connected",    connectedSince: "Jan 2026", features: ["Custom SMTP", "HTML templates", "Digest emails"] },
  { id: "sms",            name: "SMS / WhatsApp",    desc: "Send candidate updates and client alerts via SMS or WhatsApp Business API.",                       category: "communication",  icon: "💬", color: "#25D366", status: "disconnected", features: ["WhatsApp Business", "2-way SMS", "Bulk messaging"] },
  { id: "rbac",           name: "RBAC + Audit",      desc: "Role-based access control with full audit trail. See who changed what and when.",                  category: "security",       icon: "🛡️", color: "#8B5CF6", status: "connected",    connectedSince: "Jan 2026", features: ["Custom roles", "Audit log", "IP restriction"] },
  { id: "cloud-sync",     name: "Cloud Sync",        desc: "Sync workspace data to Google Drive or OneDrive automatically every 24 hours.",                   category: "productivity",   icon: "☁️", color: "#3B82F6", status: "disconnected", features: ["Google Drive", "OneDrive", "Auto-schedule"] },
  { id: "slack",          name: "Slack",             desc: "Get pipeline updates, placement alerts and invoice notifications directly in Slack channels.",     category: "communication",  icon: "🔔", color: "#E01E5A", status: "disconnected", features: ["Channel alerts", "Custom triggers", "Daily digest"] },
  { id: "linkedin",       name: "LinkedIn Recruiter",desc: "Import candidate profiles from LinkedIn Recruiter directly into BillzCore ATS.",                  category: "productivity",   icon: "🔷", color: "#0A66C2", status: "disconnected", features: ["Profile import", "1-click save", "Sync status"] },
  { id: "quickbooks",     name: "QuickBooks",        desc: "Two-way sync of invoices, payments and clients between BillzCore and QuickBooks.",                 category: "finance",        icon: "📒", color: "#2CA01C", status: "disconnected", features: ["2-way sync", "Tax mapping", "Chart of accounts"] },
  { id: "zapier",         name: "Zapier",            desc: "Connect BillzCore to 5000+ apps. Automate workflows without code.",                               category: "productivity",   icon: "⚡", color: "#FF4A00", status: "coming_soon",  features: ["5000+ apps", "Trigger events", "No-code"] },
  { id: "xero",           name: "Xero",              desc: "Accounting integration for invoice sync, expense tracking and financial reporting.",               category: "finance",        icon: "🟦", color: "#13B5EA", status: "coming_soon",  features: ["Invoice sync", "Bank feeds", "Reports"] },
  { id: "google-cal",     name: "Google Calendar",   desc: "Sync interview schedules and deadlines with Google Calendar automatically.",                       category: "communication",  icon: "📅", color: "#4285F4", status: "coming_soon",  features: ["2-way sync", "Interview blocks", "Reminders"] },
];

const CATS: { key: Category; label: string }[] = [
  { key: "all",           label: "All"           },
  { key: "database",      label: "Database"      },
  { key: "communication", label: "Communication" },
  { key: "finance",       label: "Finance"       },
  { key: "productivity",  label: "Productivity"  },
  { key: "security",      label: "Security"      },
];

const STATUS_CFG = {
  connected:    { label: "Connected",    bg: "rgba(16,185,129,0.1)",  color: "#10B981" },
  disconnected: { label: "Disconnected", bg: "rgba(148,163,184,0.1)", color: "#94A3B8" },
  coming_soon:  { label: "Coming Soon",  bg: "rgba(245,158,11,0.1)",  color: "#F59E0B" },
};

export default function IntegrationsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.status]))
  );
  const [detail, setDetail] = useState<Integration | null>(null);

  const filtered = INTEGRATIONS.filter(i =>
    (category === "all" || i.category === category) &&
    (search === "" || i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const connectedCount = Object.values(statuses).filter(s => s === "connected").length;

  function toggle(id: string) {
    setStatuses(prev => ({ ...prev, [id]: prev[id] === "connected" ? "disconnected" : "connected" }));
    if (detail?.id === id) setDetail(d => d ? { ...d, status: statuses[id] === "connected" ? "disconnected" : "connected" } : null);
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Banner — inspired by reference image */}
      <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#1e4535 40%,#163328 100%)", minHeight: "200px" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-7 sm:p-10 items-center">
          {/* Left */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              <span className="h-px w-6 bg-white/30" />INTEGRATIONS
            </p>
            <h1 className="text-[22px] sm:text-[28px] font-extrabold leading-tight mb-4 text-white">
              Connects to the tools your<br />back office already runs.
            </h1>
            <ul className="space-y-2">
              {["Neon Postgres + Auth", "PDF invoicing & quotations", "Email & SMS-ready notifications", "Role-based access & audit trail"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[12.5px]" style={{ color: "rgba(255,255,255,0.72)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <div className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[20px] font-extrabold text-white">{connectedCount}</p>
                <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>Connected</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[20px] font-extrabold text-white">{INTEGRATIONS.length}</p>
                <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>Total</p>
              </div>
            </div>
          </div>
          {/* Right — icon grid (reference style) */}
          <div className="grid grid-cols-3 gap-2.5">
            {INTEGRATIONS.slice(0, 9).map(i => (
              <div key={i.id} onClick={() => setDetail(i)}
                className="flex flex-col items-center gap-2 py-4 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-2xl">{i.icon}</span>
                <span className="text-[10.5px] font-semibold text-center leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>{i.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap p-1 rounded-xl border" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
          {CATS.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
              style={{ backgroundColor: category === c.key ? "#6366F1" : "transparent", color: category === c.key ? "#fff" : "var(--bz-text-3)" }}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-60">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search integrations…"
            className="w-full h-9 rounded-lg pl-8 pr-3 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
            style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(intg => {
          const st = STATUS_CFG[statuses[intg.id]];
          const isConnected = statuses[intg.id] === "connected";
          const isComingSoon = intg.status === "coming_soon";
          return (
            <div key={intg.id} className="rounded-xl border flex flex-col overflow-hidden transition-all hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "var(--bz-card-bg)", borderColor: isConnected ? intg.color + "44" : "var(--bz-border-hard)" }}
              onClick={() => setDetail(intg)}>
              {/* Top accent */}
              <div className="h-1" style={{ backgroundColor: isConnected ? intg.color : "transparent" }} />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl shrink-0"
                      style={{ backgroundColor: intg.color + "14", border: `1.5px solid ${intg.color}30` }}>
                      {intg.icon}
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>{intg.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: st.bg, color: st.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.color }} />{st.label}
                      </span>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="h-2.5 w-2.5 rounded-full animate-pulse shrink-0 mt-1" style={{ backgroundColor: "#10B981" }} />
                  )}
                </div>
                <p className="text-[12px] leading-relaxed flex-1 mb-4" style={{ color: "var(--bz-text-3)" }}>{intg.desc}</p>
                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {intg.features.map(f => (
                    <span key={f} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full border"
                      style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>{f}</span>
                  ))}
                </div>
                {/* Action */}
                <button
                  onClick={e => { e.stopPropagation(); if (!isComingSoon) toggle(intg.id); }}
                  className="w-full py-2 rounded-lg text-[12.5px] font-bold transition-all"
                  style={isComingSoon
                    ? { backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B", cursor: "not-allowed" }
                    : isConnected
                      ? { backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }
                      : { background: `linear-gradient(135deg,${intg.color},${intg.color}cc)`, color: "#fff" }}>
                  {isComingSoon ? "Coming Soon" : isConnected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🔌</span>
          <p className="text-[14px] font-semibold" style={{ color: "var(--bz-text-3)" }}>No integrations found</p>
          <button onClick={() => { setSearch(""); setCategory("all"); }} className="text-[13px] font-semibold" style={{ color: "#6366F1" }}>Clear filters</button>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (() => {
        const st = STATUS_CFG[statuses[detail.id]];
        const isConnected = statuses[detail.id] === "connected";
        const isComingSoon = detail.status === "coming_soon";
        return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={() => setDetail(null)}>
            <div className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
              style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="h-1.5" style={{ backgroundColor: detail.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                      style={{ backgroundColor: detail.color + "14", border: `1.5px solid ${detail.color}30` }}>
                      {detail.icon}
                    </div>
                    <div>
                      <p className="text-[17px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{detail.name}</p>
                      <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full mt-1"
                        style={{ backgroundColor: st.bg, color: st.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: st.color }} />{st.label}
                        {isConnected && detail.connectedSince && <span className="opacity-60">since {detail.connectedSince}</span>}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setDetail(null)} className="h-8 w-8 flex items-center justify-center rounded-lg" style={{ color: "var(--bz-text-3)" }}>✕</button>
                </div>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--bz-text-2)" }}>{detail.desc}</p>
                {/* Features */}
                <div className="mb-5">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--bz-text-3)" }}>Capabilities</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {detail.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: detail.color }} />{f}
                      </div>
                    ))}
                  </div>
                </div>
                {isConnected && (
                  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <p className="text-[12px] font-semibold" style={{ color: "#10B981" }}>✓ Active & syncing — last sync 2 minutes ago</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setDetail(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border"
                    style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Close</button>
                  {!isComingSoon && (
                    <button onClick={() => toggle(detail.id)}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white"
                      style={{ background: isConnected ? "linear-gradient(135deg,#EF4444,#DC2626)" : `linear-gradient(135deg,${detail.color},${detail.color}cc)` }}>
                      {isConnected ? "Disconnect" : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
