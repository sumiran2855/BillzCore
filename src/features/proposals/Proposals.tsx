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
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-bold w-8 text-right shrink-0" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [statusFilter, setStatusFilter] = useState<"all" | ProposalStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProposal, setEditProposal] = useState<Proposal | null>(null);

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
  const winRate = proposals.filter(p => ["accepted","rejected"].includes(p.status)).length
    ? Math.round((counts["accepted"] || 0) / proposals.filter(p => ["accepted","rejected"].includes(p.status)).length * 100) : 0;

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Proposals</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {proposals.length} total · {counts["accepted"] || 0} accepted · {winRate}% win rate
          </p>
        </div>
        <button onClick={() => { setEditProposal(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-semibold text-white shadow-lg shrink-0"
          style={{ background: "var(--bz-gradient)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="hidden sm:inline">New Proposal</span>
          <span className="sm:hidden">New</span>
        </button>
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
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search proposals…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <span className="text-4xl">📋</span>
            <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No proposals match your filter</p>
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} className="rounded-xl border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            {/* Color bar by probability */}
            <div className="h-1" style={{ background: p.probability >= 70 ? "linear-gradient(90deg,#10B981,#059669)" : p.probability >= 40 ? "linear-gradient(90deg,#F59E0B,#D97706)" : "linear-gradient(90deg,#EF4444,#DC2626)" }} />
            <div className="p-4">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold" style={{ color: "#6366F1" }}>{p.proposalNumber}</p>
                  <p className="text-[13.5px] font-bold mt-0.5 line-clamp-2 leading-tight" style={{ color: "var(--bz-text-1)" }}>{p.title}</p>
                </div>
                <StatusPill status={p.status} />
              </div>

              {/* Client */}
              <p className="text-[12px] font-semibold" style={{ color: "var(--bz-text-2)" }}>{p.clientName}</p>
              <p className="text-[11px] mt-0.5 mb-3" style={{ color: "var(--bz-text-3)" }}>Valid until {p.validUntil}</p>

              {/* Summary excerpt */}
              {p.executiveSummary && (
                <p className="text-[11.5px] leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--bz-text-3)" }}>{p.executiveSummary}</p>
              )}

              {/* Probability */}
              <div className="mb-3">
                <div className="flex justify-between text-[10.5px] mb-1" style={{ color: "var(--bz-text-3)" }}>
                  <span>Win Probability</span>
                </div>
                <ProbabilityBar value={p.probability} />
              </div>

              {/* Value + actions */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                <div>
                  <p className="text-[15px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{p.currency} {p.total.toLocaleString()}</p>
                  <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>{p.lineItems.length} line item{p.lineItems.length !== 1 ? "s" : ""}</p>
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
          </div>
        ))}
      </div>

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
