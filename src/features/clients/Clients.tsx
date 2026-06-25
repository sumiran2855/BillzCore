"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Client, ClientStatus, mockClients, INDUSTRIES } from "./clientTypes";
import ClientModal from "./clientModal";

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  active:     { label: "Active",     color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  inactive:   { label: "Inactive",   color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  prospect:   { label: "Prospect",   color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  onboarding: { label: "Onboarding", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  churned:    { label: "Churned",    color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
};

const COLORS = ["#6366F1","#8B5CF6","#10B981","#06B6D4","#F59E0B","#EF4444","#EC4899"];
function avatarColor(id: string) { return COLORS[parseInt(id) % COLORS.length]; }
function initials(name: string) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

function StatusPill({ status }: { status: ClientStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold" style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
      {c.label}
    </span>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(c => {
      const matchSearch = !q || `${c.companyName} ${c.code} ${c.industry} ${c.country} ${c.contactName}`.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchIndustry = industryFilter === "all" || c.industry === industryFilter;
      return matchSearch && matchStatus && matchIndustry;
    });
  }, [clients, search, statusFilter, industryFilter]);

  function handleSave(form: any) {
    if (editClient) {
      setClients(prev => prev.map(c => c.id === editClient.id ? { ...c, ...form } : c));
    } else {
      const newClient: Client = {
        id: String(Date.now()), code: `CL-${2000 + clients.length}`,
        companyName: form.companyName, industry: form.industry,
        country: form.country, city: form.city, address: form.address,
        website: form.website, status: form.status,
        contactName: form.contactName, contactRole: form.contactRole,
        contactEmail: form.contactEmail, contactPhone: form.contactPhone,
        totalRevenue: 0, currency: form.currency, openInvoices: 0,
        totalDeals: 0, activeCandidates: 0,
        contractStart: form.contractStart, contractEnd: form.contractEnd || undefined,
        accountManager: form.accountManager, notes: form.notes,
        registeredDate: new Date().toISOString().split("T")[0],
      };
      setClients(prev => [newClient, ...prev]);
    }
    setEditClient(null);
  }

  const counts: Record<string, number> = { all: clients.length };
  clients.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Clients</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {clients.length} total · {counts["active"] || 0} active · {counts["prospect"] || 0} prospects
          </p>
        </div>
        <button
          onClick={() => { setEditClient(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-semibold text-white shadow-lg shrink-0"
          style={{ background: "var(--bz-gradient)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="hidden sm:inline">Add Client</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "active", "prospect", "onboarding", "inactive", "churned"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1 rounded-full text-[11.5px] font-semibold transition-all"
            style={{
              backgroundColor: statusFilter === s ? (s === "all" ? "#6366F1" : STATUS_CONFIG[s as ClientStatus]?.color || "#6366F1") : "var(--bz-bg)",
              color: statusFilter === s ? "#fff" : "var(--bz-text-3)",
              border: "1px solid var(--bz-border-hard)",
            }}>
            {s === "all" ? `All (${counts.all})` : `${STATUS_CONFIG[s as ClientStatus].label} (${counts[s] || 0})`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
            style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
        </div>
        <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}
          className="h-9 rounded-lg px-2 sm:px-3 text-[11.5px] sm:text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
          <option value="all">All Industries</option>
          {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
        </select>
        <div className="flex items-center gap-1 rounded-lg border p-0.5 shrink-0" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-card-bg)" }}>
          {(["grid", "list"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className="h-7 w-7 flex items-center justify-center rounded-md transition-all"
              style={{ backgroundColor: viewMode === m ? "rgba(99,102,241,0.12)" : "transparent", color: viewMode === m ? "#6366F1" : "var(--bz-text-3)" }}>
              {m === "grid"
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
            </button>
          ))}
        </div>
        <span className="text-[12px] font-semibold" style={{ color: "var(--bz-text-3)" }}>{filtered.length} results</span>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => {
            const color = avatarColor(c.id);
            return (
              <Link href={`/dashboard/clients/${c.id}`} key={c.id}>
                <div className="rounded-xl border p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-[13px] font-extrabold"
                        style={{ background: `linear-gradient(135deg,${color},${color}aa)` }}>
                        {initials(c.companyName)}
                      </span>
                      <div>
                        <p className="text-[14px] font-bold leading-tight" style={{ color: "var(--bz-text-1)" }}>{c.companyName}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{c.code} · {c.industry}</p>
                      </div>
                    </div>
                    <StatusPill status={c.status} />
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>📍 {c.city}, {c.country}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Revenue", value: `${c.currency} ${(c.totalRevenue / 1000).toFixed(0)}K`, color: "#6366F1" },
                      { label: "Deals", value: c.totalDeals, color: "#10B981" },
                      { label: "Active", value: c.activeCandidates, color: "#F59E0B" },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-lg p-2 text-center" style={{ backgroundColor: "var(--bz-bg)" }}>
                        <p className="text-[13px] font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-[9.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full text-white text-[9px] font-bold" style={{ background: "var(--bz-gradient)" }}>
                        {initials(c.contactName)}
                      </span>
                      <span className="text-[11.5px]" style={{ color: "var(--bz-text-2)" }}>{c.contactName}</span>
                    </div>
                    {c.openInvoices > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.10)", color: "#EF4444" }}>
                        {c.openInvoices} open invoice{c.openInvoices > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="hidden sm:grid grid-cols-[44px_1fr_120px_100px_110px_90px_80px] gap-4 px-4 py-2.5 border-b text-[11px] font-bold uppercase tracking-wider" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>
            <div /><div>Client</div><div>Industry</div><div>Country</div><div>Revenue</div><div>Status</div><div>Actions</div>
          </div>
          {filtered.map(c => {
            const color = avatarColor(c.id);
            return (
              <div key={c.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                {/* Mobile */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-3 hover:bg-[rgba(99,102,241,0.02)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-[11px] font-bold" style={{ background: `linear-gradient(135deg,${color},${color}aa)` }}>{initials(c.companyName)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{c.companyName}</p>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{c.industry} · {c.country}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[12px] font-bold" style={{ color: "#6366F1" }}>{c.currency} {(c.totalRevenue/1000).toFixed(0)}K</p>
                      <div className="flex items-center gap-1.5">
                        <Link href={`/dashboard/clients/${c.id}`}>
                          <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                        </Link>
                        <button onClick={() => { setEditClient(c); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[44px_1fr_120px_100px_110px_90px_80px] gap-4 px-4 py-3 items-center hover:bg-[rgba(99,102,241,0.02)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-[10px] font-bold" style={{ background: `linear-gradient(135deg,${color},${color}aa)` }}>{initials(c.companyName)}</span>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{c.companyName}</p>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{c.code} · {c.contactName}</p>
                  </div>
                  <p className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{c.industry}</p>
                  <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{c.country}</p>
                  <p className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{c.currency} {(c.totalRevenue/1000).toFixed(0)}K</p>
                  <StatusPill status={c.status} />
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/clients/${c.id}`}>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </Link>
                    <button onClick={() => { setEditClient(c); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl">🏢</span>
          <p className="mt-4 text-[14px] font-semibold" style={{ color: "var(--bz-text-2)" }}>No clients found</p>
          <p className="text-[12.5px] mt-1" style={{ color: "var(--bz-text-3)" }}>Try adjusting your filters</p>
        </div>
      )}

      <ClientModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditClient(null); }}
        onSave={handleSave}
        client={editClient}
        mode={editClient ? "edit" : "add"}
      />
    </div>
  );
}
