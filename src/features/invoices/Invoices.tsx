"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Invoice, InvoiceStatus, STATUS_CONFIG, mockInvoices } from "./invoiceTypes";
import InvoiceModal from "./invoiceModal";

function StatusPill({ status }: { status: InvoiceStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
      {c.label}
    </span>
  );
}

function isOverdue(inv: Invoice) {
  return inv.status !== "paid" && inv.status !== "cancelled" && new Date(inv.dueDate) < new Date();
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter(inv => {
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchSearch = !q || `${inv.invoiceNumber} ${inv.clientName} ${inv.currency}`.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [invoices, search, statusFilter]);

  const counts: Record<string, number> = { all: invoices.length };
  invoices.forEach(inv => { counts[inv.status] = (counts[inv.status] || 0) + 1; });

  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoices.filter(i => ["sent","overdue","partial"].includes(i.status)).reduce((s, i) => s + (i.total - i.amountPaid), 0);
  const overdueCount = invoices.filter(i => i.status === "overdue" || isOverdue(i)).length;

  function handleSave(form: any) {
    const client = { id: form.clientId, name: "" };
    const lineItems = form.lineItems.map((li: any, idx: number) => ({
      id: String(idx + 1), description: li.description,
      quantity: Number(li.quantity), unitPrice: Number(li.unitPrice),
      amount: Number(li.quantity) * Number(li.unitPrice),
    }));
    const subtotal = lineItems.reduce((s: number, li: any) => s + li.amount, 0);
    const taxAmount = Math.round(subtotal * Number(form.taxRate) / 100);
    const total = subtotal + taxAmount - Number(form.discount);
    const selectedClient = { clientEmail: "", clientAddress: "" };

    if (editInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === editInvoice.id ? {
        ...inv, ...form, lineItems, subtotal, taxAmount, total,
        taxRate: Number(form.taxRate), discount: Number(form.discount),
        amountPaid: form.status === "paid" ? total : inv.amountPaid,
      } : inv));
    } else {
      const inv: Invoice = {
        id: String(Date.now()), invoiceNumber: form.invoiceNumber,
        clientId: form.clientId, clientName: mockInvoices.find(i => i.clientId === form.clientId)?.clientName || form.clientId,
        clientEmail: form.clientEmail || "", clientAddress: form.clientAddress || "",
        status: form.status, issueDate: form.issueDate, dueDate: form.dueDate,
        lineItems, subtotal, taxRate: Number(form.taxRate), taxAmount,
        discount: Number(form.discount), total, amountPaid: form.status === "paid" ? total : 0,
        currency: form.currency, notes: form.notes, terms: form.terms,
        accountManager: "Arjun Kumar",
      };
      setInvoices(prev => [inv, ...prev]);
    }
    setEditInvoice(null);
  }

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Invoices</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {invoices.length} total · {counts["paid"] || 0} paid · {overdueCount} overdue
          </p>
        </div>
        <button
          onClick={() => { setEditInvoice(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-semibold text-white shadow-lg shrink-0"
          style={{ background: "var(--bz-gradient)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="hidden sm:inline">New Invoice</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Invoices", value: invoices.length, sub: "All time", color: "#6366F1", icon: "🧾" },
          { label: "Paid Revenue", value: `${totalRevenue.toLocaleString()}`, sub: "Multi-currency", color: "#10B981", icon: "✅" },
          { label: "Outstanding", value: `${Math.round(totalOutstanding).toLocaleString()}`, sub: "Pending collection", color: "#F59E0B", icon: "⏳" },
          { label: "Overdue", value: overdueCount, sub: "Need attention", color: "#EF4444", icon: "⚠️" },
        ].map(card => (
          <div key={card.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${card.color}18`, color: card.color }}>
                {card.sub}
              </span>
            </div>
            <p className="text-[20px] sm:text-[22px] font-extrabold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "draft", "sent", "paid", "overdue", "partial", "cancelled"] as const).map(s => {
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
        <input type="text" placeholder="Search invoices…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[120px_1fr_110px_110px_120px_90px_80px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
          <span>Invoice #</span><span>Client</span><span>Issue Date</span><span>Due Date</span><span>Amount</span><span>Status</span><span>Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl">🧾</span>
            <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No invoices match your filter</p>
          </div>
        )}

        {filtered.map(inv => (
          <div key={inv.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
            {/* Mobile */}
            <div className="sm:hidden px-4 py-3 hover:bg-[rgba(99,102,241,0.02)]">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{inv.invoiceNumber}</span>
                  <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{inv.clientName}</p>
                </div>
                <StatusPill status={inv.status} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Due {inv.dueDate}</p>
                  <p className="text-[14px] font-extrabold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{inv.currency} {inv.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/dashboard/invoices/${inv.id}`}>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </Link>
                  <button onClick={() => { setEditInvoice(inv); setModalOpen(true); }} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Desktop */}
            <div className="hidden sm:grid grid-cols-[120px_1fr_110px_110px_120px_90px_80px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]">
              <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{inv.invoiceNumber}</span>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{inv.clientName}</p>
                <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{inv.clientEmail}</p>
              </div>
              <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{inv.issueDate}</span>
              <span className="text-[12px]" style={{ color: isOverdue(inv) ? "#EF4444" : "var(--bz-text-2)" }}>{inv.dueDate}</span>
              <div>
                <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{inv.currency} {inv.total.toLocaleString()}</p>
                {inv.status === "partial" && (
                  <p className="text-[10.5px]" style={{ color: "#F59E0B" }}>Paid: {inv.currency} {inv.amountPaid.toLocaleString()}</p>
                )}
              </div>
              <StatusPill status={inv.status} />
              <div className="flex items-center gap-1">
                <Link href={`/dashboard/invoices/${inv.id}`}>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </Link>
                <button onClick={() => { setEditInvoice(inv); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InvoiceModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditInvoice(null); }}
        onSave={handleSave}
        invoice={editInvoice}
        mode={editInvoice ? "edit" : "add"}
      />
    </div>
  );
}
