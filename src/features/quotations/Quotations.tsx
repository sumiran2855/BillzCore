"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Quotation, QuotationStatus, STATUS_CONFIG, mockQuotations } from "./quotationTypes";
import QuotationModal from "./quotationModal";

function StatusPill({ status }: { status: QuotationStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
      {c.label}
    </span>
  );
}

function isExpired(q: Quotation) {
  return q.status !== "accepted" && q.status !== "converted"
    && new Date(q.validUntil) < new Date();
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [statusFilter, setStatusFilter] = useState<"all" | QuotationStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuote, setEditQuote] = useState<Quotation | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return quotations.filter(qt => {
      const matchStatus = statusFilter === "all" || qt.status === statusFilter;
      const matchSearch = !q || `${qt.quoteNumber} ${qt.clientName} ${qt.currency}`.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [quotations, search, statusFilter]);

  const counts: Record<string, number> = { all: quotations.length };
  quotations.forEach(q => { counts[q.status] = (counts[q.status] || 0) + 1; });

  const totalValue = quotations.reduce((s, q) => s + q.total, 0);
  const acceptedValue = quotations.filter(q => q.status === "accepted").reduce((s, q) => s + q.total, 0);
  const conversionRate = quotations.length ? Math.round((counts["accepted"] || 0) / quotations.length * 100) : 0;

  function handleSave(form: any) {
    const lineItems = form.lineItems.map((li: any, i: number) => ({
      id: String(i + 1), description: li.description,
      quantity: Number(li.quantity), unitPrice: Number(li.unitPrice),
      amount: Number(li.quantity) * Number(li.unitPrice),
    }));
    const subtotal = lineItems.reduce((s: number, li: any) => s + li.amount, 0);
    const taxAmount = Math.round(subtotal * Number(form.taxRate) / 100);
    const total = subtotal + taxAmount - Number(form.discount);

    if (editQuote) {
      setQuotations(prev => prev.map(q => q.id === editQuote.id
        ? { ...q, ...form, lineItems, subtotal, taxAmount, total, taxRate: Number(form.taxRate), discount: Number(form.discount) }
        : q));
    } else {
      setQuotations(prev => [{
        id: String(Date.now()), quoteNumber: form.quoteNumber,
        clientId: form.clientId, clientName: mockQuotations.find(q => q.clientId === form.clientId)?.clientName || form.clientId,
        clientEmail: "", clientAddress: "", status: form.status,
        issueDate: form.issueDate, validUntil: form.validUntil,
        lineItems, subtotal, taxRate: Number(form.taxRate), taxAmount,
        discount: Number(form.discount), total, currency: form.currency,
        notes: form.notes, terms: form.terms, accountManager: "Arjun Kumar",
      }, ...prev]);
    }
    setEditQuote(null);
  }

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Quotations</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {quotations.length} total · {counts["accepted"] || 0} accepted · {conversionRate}% conversion rate
          </p>
        </div>
        <button onClick={() => { setEditQuote(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-semibold text-white shadow-lg shrink-0"
          style={{ background: "var(--bz-gradient)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="hidden sm:inline">New Quote</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Quotes", value: quotations.length, sub: "All time", color: "#6366F1", icon: "📋" },
          { label: "Pipeline Value", value: totalValue.toLocaleString(), sub: "Multi-currency", color: "#8B5CF6", icon: "💼" },
          { label: "Accepted Value", value: acceptedValue.toLocaleString(), sub: "Won deals", color: "#10B981", icon: "✅" },
          { label: "Conversion Rate", value: `${conversionRate}%`, sub: "Acceptance rate", color: "#F59E0B", icon: "📊" },
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

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "draft", "sent", "accepted", "rejected", "expired", "converted"] as const).map(s => {
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
        <input type="text" placeholder="Search quotations…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="hidden sm:grid grid-cols-[120px_1fr_110px_110px_120px_100px_80px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
          <span>Quote #</span><span>Client</span><span>Issue Date</span><span>Valid Until</span><span>Amount</span><span>Status</span><span>Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl">📋</span>
            <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No quotations match your filter</p>
          </div>
        )}

        {filtered.map(qt => {
          const expired = isExpired(qt);
          return (
            <div key={qt.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
              {/* Mobile */}
              <div className="sm:hidden px-4 py-3 hover:bg-[rgba(99,102,241,0.02)]">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{qt.quoteNumber}</span>
                    <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{qt.clientName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusPill status={qt.status} />
                    {expired && <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>Expired</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <div>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Valid until {qt.validUntil}</p>
                    <p className="text-[14px] font-extrabold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{qt.currency} {qt.total.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/dashboard/quotations/${qt.id}`}>
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </Link>
                    <button onClick={() => { setEditQuote(qt); setModalOpen(true); }} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-[120px_1fr_110px_110px_120px_100px_80px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]">
                <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{qt.quoteNumber}</span>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{qt.clientName}</p>
                  <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{qt.clientEmail}</p>
                </div>
                <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{qt.issueDate}</span>
                <span className="text-[12px]" style={{ color: expired ? "#EF4444" : "var(--bz-text-2)" }}>{qt.validUntil}</span>
                <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{qt.currency} {qt.total.toLocaleString()}</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <StatusPill status={qt.status} />
                  {expired && <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>Expired</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/quotations/${qt.id}`}>
                    <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </Link>
                  <button onClick={() => { setEditQuote(qt); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <QuotationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditQuote(null); }}
        onSave={handleSave}
        quotation={editQuote}
        mode={editQuote ? "edit" : "add"}
      />
    </div>
  );
}
