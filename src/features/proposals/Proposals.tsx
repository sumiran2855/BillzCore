"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Proposal, ProposalStatus, STATUS_CONFIG, mockProposals } from "./proposalTypes";
import ProposalModal from "./proposalModal";

function StatusPill({ status }: { status: ProposalStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
      {c.label}
    </span>
  );
}

function ProbabilityBar({ value }: { value: number }) {
  const color = value >= 70 ? "#10B981" : value >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />
      </div>
      <span className="text-[11.5px] font-extrabold w-8 text-right shrink-0" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [statusFilter, setStatusFilter] = useState<"all" | ProposalStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProposal, setEditProposal] = useState<Proposal | null>(null);
  const [view, setView] = useState<"card" | "list">("card");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return proposals.filter(p => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchSearch = !q || `${p.proposalNumber} ${p.title} ${p.clientName}`.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [proposals, search, statusFilter]);

  const counts: Record<string, number> = { all: proposals.length };
  proposals.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });

  const totalValue = proposals.reduce((s, p) => s + p.total, 0);
  const weightedValue = proposals.reduce((s, p) => s + p.total * p.probability / 100, 0);
  const winRate = proposals.filter(p => ["accepted", "rejected"].includes(p.status)).length
    ? Math.round((counts["accepted"] || 0) / proposals.filter(p => ["accepted", "rejected"].includes(p.status)).length * 100) : 0;

  function handleSave(form: any) {
    const lineItems = form.lineItems.map((li: any, i: number) => ({
      id: String(i + 1), description: li.description,
      quantity: Number(li.quantity), unitPrice: Number(li.unitPrice),
      amount: Number(li.quantity) * Number(li.unitPrice),
    }));
    const subtotal = lineItems.reduce((s: number, li: any) => s + li.amount, 0);
    const taxAmount = Math.round(subtotal * Number(form.taxRate) / 100);
    const total = subtotal + taxAmount - Number(form.discount);

    if (editProposal) {
      setProposals(prev => prev.map(p => p.id === editProposal.id
        ? { ...p, ...form, lineItems, subtotal, taxAmount, total, taxRate: Number(form.taxRate), discount: Number(form.discount), probability: Number(form.probability) }
        : p));
    } else {
      const client = mockProposals.find(p => p.clientId === form.clientId);
      setProposals(prev => [{
        id: String(Date.now()), proposalNumber: form.proposalNumber, title: form.title,
        clientId: form.clientId, clientName: client?.clientName || form.clientId,
        clientEmail: client?.clientEmail || "", clientAddress: client?.clientAddress || "",
        status: form.status, issueDate: form.issueDate, validUntil: form.validUntil,
        lineItems, subtotal, taxRate: Number(form.taxRate), taxAmount,
        discount: Number(form.discount), total, currency: form.currency,
        probability: Number(form.probability), accountManager: "Arjun Kumar",
        executiveSummary: form.executiveSummary, scopeOfWork: form.scopeOfWork,
        deliverables: form.deliverables, timeline: form.timeline,
        notes: form.notes, terms: form.terms,
      }, ...prev]);
    }
    setEditProposal(null);
  }

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Proposals</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {proposals.length} total · {counts["accepted"] || 0} accepted · {winRate}% win rate
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-xl border shrink-0" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
            {(["card", "list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all capitalize"
                style={{ backgroundColor: view === v ? "#6366F1" : "transparent", color: view === v ? "#fff" : "var(--bz-text-3)" }}>
                {v === "card" ? "🗂 Cards" : "☰ List"}
              </button>
            ))}
          </div>
          <button onClick={() => { setEditProposal(null); setModalOpen(true); }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-semibold text-white shadow-lg shrink-0"
            style={{ background: "var(--bz-gradient)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span className="hidden sm:inline">New Proposal</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Proposals", value: proposals.length, sub: "All time", color: "#6366F1", icon: "📋" },
          { label: "Total Value", value: totalValue.toLocaleString(), sub: "Multi-currency", color: "#8B5CF6", icon: "💼" },
          { label: "Weighted Value", value: Math.round(weightedValue).toLocaleString(), sub: "Probability-adjusted", color: "#10B981", icon: "📊" },
          { label: "Win Rate", value: `${winRate}%`, sub: "Accepted vs closed", color: "#F59E0B", icon: "🏆" },
        ].map(card => (
          <div key={card.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${card.color}18`, color: card.color }}>{card.sub}</span>
            </div>
            <p className="text-[20px] sm:text-[22px] font-extrabold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "draft", "sent", "under_review", "accepted", "rejected", "expired"] as const).map(s => {
          const cfg = s !== "all" ? STATUS_CONFIG[s] : null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-full text-[11.5px] font-semibold transition-all"
              style={{
                backgroundColor: statusFilter === s ? (cfg?.color || "#6366F1") : "var(--bz-bg)",
                color: statusFilter === s ? "#fff" : "var(--bz-text-3)",
                border: "1px solid var(--bz-border-hard)",
              }}>
              {s === "all" ? `All (${counts.all})` : `${STATUS_CONFIG[s].label} (${counts[s] || 0})`}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" placeholder="Search proposals…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
      </div>

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <span className="text-4xl">📋</span>
              <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No proposals match your filter</p>
            </div>
          )}
          {filtered.map(p => (
            <div key={p.id} className="relative rounded-2xl border p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>

              <div className="pl-2">
                {/* Header: Status and Code */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold font-mono tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {p.proposalNumber}
                    </span>
                    <span className="text-[10.5px] font-semibold text-gray-400">
                      • {p.issueDate}
                    </span>
                  </div>
                  <StatusPill status={p.status} />
                </div>

                {/* Title & Click Target */}
                <Link href={`/dashboard/proposals/${p.id}`} className="block">
                  <span className="absolute inset-0" />
                  <h3 className="text-[14.5px] font-extrabold leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[#6366F1]" style={{ color: "var(--bz-text-1)" }}>
                    {p.title}
                  </h3>
                </Link>

                {/* Client Info */}
                <div className="mt-3 flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1.5 font-bold" style={{ color: "var(--bz-text-2)" }}>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-extrabold">
                      {p.clientName.charAt(0)}
                    </div>
                    <span>{p.clientName}</span>
                  </div>
                  <span className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>
                    Expires: {p.validUntil}
                  </span>
                </div>

                {/* Excerpt / Summary */}
                {p.executiveSummary && (
                  <p className="text-[11.5px] leading-relaxed line-clamp-2 mt-3" style={{ color: "var(--bz-text-3)" }}>
                    {p.executiveSummary}
                  </p>
                )}

                {/* Line Items Preview */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {p.lineItems.slice(0, 2).map(li => (
                    <span key={li.id} className="text-[10.5px] font-medium px-2 py-0.5 rounded-full border border-dashed truncate max-w-[130px]"
                      style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)", backgroundColor: "var(--bz-bg)" }}>
                      {li.description}
                    </span>
                  ))}
                  {p.lineItems.length > 2 && (
                    <span className="text-[10px] font-semibold self-center" style={{ color: "var(--bz-text-3)" }}>
                      +{p.lineItems.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pl-2 mt-5 pt-4 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                {/* Stats Row: Price and Win Probability */}
                <div className="flex items-center justify-between mb-3.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--bz-text-3)" }}>Value</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[12px] font-bold text-gray-400">{p.currency}</span>
                      <span className="text-[17px] font-extrabold leading-none" style={{ color: "var(--bz-text-1)" }}>
                        {p.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--bz-text-3)" }}>Win Probability</span>
                    <div className="flex items-center gap-1.5 justify-end mt-1">
                      <span className="text-[12px] font-extrabold" style={{ color: p.probability >= 70 ? "#10B981" : p.probability >= 40 ? "#F59E0B" : "#EF4444" }}>
                        {p.probability}%
                      </span>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: p.probability >= 70 ? "#10B981" : p.probability >= 40 ? "#F59E0B" : "#EF4444" }} />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex items-center justify-between pt-1 relative z-10">
                  <div className="flex items-center gap-1">
                    <span className="text-[10.5px] font-medium" style={{ color: "var(--bz-text-3)" }}>
                      Managed by <strong style={{ color: "var(--bz-text-2)" }}>{p.accountManager}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/proposals/${p.id}`} title="View Details">
                      <button className="h-8 px-3 flex items-center justify-center gap-1 rounded-lg text-[11.5px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 active:bg-indigo-500/30 transition-all duration-200" style={{ color: "#6366F1" }}>
                        <span>View</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    </Link>
                    <button onClick={() => { setEditProposal(p); setModalOpen(true); }} title="Edit Proposal" className="h-8 w-8 flex items-center justify-center rounded-lg border hover:bg-[rgba(99,102,241,0.08)] active:bg-[rgba(99,102,241,0.15)] transition-all duration-200" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="hidden sm:grid grid-cols-[120px_1fr_110px_110px_120px_100px_100px_80px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
            <span>Proposal #</span><span>Title / Client</span><span>Issue Date</span><span>Valid Until</span><span>Amount</span><span>Win Prob.</span><span>Status</span><span>Actions</span>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl">📋</span>
              <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No proposals match your filter</p>
            </div>
          )}

          {filtered.map(p => (
            <div key={p.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
              {/* Mobile */}
              <div className="sm:hidden px-4 py-3 hover:bg-[rgba(99,102,241,0.02)]">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{p.proposalNumber}</span>
                    <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{p.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{p.clientName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusPill status={p.status} />
                    <span className="text-[11px] font-extrabold" style={{ color: p.probability >= 70 ? "#10B981" : p.probability >= 40 ? "#F59E0B" : "#EF4444" }}>{p.probability}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <div>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Valid until {p.validUntil}</p>
                    <p className="text-[14px] font-extrabold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{p.currency} {p.total.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/dashboard/proposals/${p.id}`}>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </Link>
                    <button onClick={() => { setEditProposal(p); setModalOpen(true); }} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-[120px_1fr_110px_110px_120px_100px_100px_80px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]">
                <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{p.proposalNumber}</span>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{p.title}</p>
                  <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{p.clientName}</p>
                </div>
                <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{p.issueDate}</span>
                <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{p.validUntil}</span>
                <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{p.currency} {p.total.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] font-bold" style={{ color: p.probability >= 70 ? "#10B981" : p.probability >= 40 ? "#F59E0B" : "#EF4444" }}>{p.probability}%</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusPill status={p.status} />
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/proposals/${p.id}`}>
                    <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </Link>
                  <button onClick={() => { setEditProposal(p); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProposalModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProposal(null); }}
        onSave={handleSave}
        proposal={editProposal}
        mode={editProposal ? "edit" : "add"}
      />
    </div>
  );
}
