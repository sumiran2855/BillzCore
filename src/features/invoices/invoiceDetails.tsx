"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { mockInvoices, InvoiceStatus, STATUS_CONFIG } from "./invoiceTypes";
import InvoiceModal from "./invoiceModal";

function isOverdue(dueDate: string, status: InvoiceStatus) {
  return status !== "paid" && status !== "cancelled" && new Date(dueDate) < new Date();
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [editOpen, setEditOpen] = useState(false);

  const invoice = invoices.find(i => i.id === params?.id);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">🧾</span>
        <p className="text-[15px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Invoice not found</p>
        <Link href="/dashboard/invoices">
          <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
            ← Back to Invoices
          </button>
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[invoice.status];
  const overdue = isOverdue(invoice.dueDate, invoice.status);
  const balance = invoice.total - invoice.amountPaid;

  function handleSave(form: any) {
    setInvoices(prev => prev.map(inv => inv.id === invoice!.id ? { ...inv, ...form } : inv));
  }

  function markAs(status: InvoiceStatus) {
    setInvoices(prev => prev.map(inv => inv.id === invoice!.id ? {
      ...inv, status,
      amountPaid: status === "paid" ? inv.total : inv.amountPaid,
    } : inv));
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--bz-text-3)" }}>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/invoices" className="hover:underline">Invoices</Link>
        <span>/</span>
        <span style={{ color: "var(--bz-text-1)" }}>{invoice.invoiceNumber}</span>
      </div>

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[20px] sm:text-[22px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{invoice.invoiceNumber}</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </span>
          {overdue && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}>Overdue</span>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status !== "paid" && (
            <button onClick={() => markAs("paid")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
              ✓ Mark as Paid
            </button>
          )}
          {invoice.status === "draft" && (
            <button onClick={() => markAs("sent")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
              Send Invoice
            </button>
          )}
          <button onClick={() => setEditOpen(true)} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-card-bg)", color: "var(--bz-text-2)" }}>
            Edit
          </button>
          <button className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-card-bg)", color: "var(--bz-text-2)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Invoice Document */}
        <div className="xl:col-span-2 rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          {/* Invoice header */}
          <div className="p-5 sm:p-8 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--bz-gradient)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  </span>
                  <span className="text-[16px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>BillzCore</span>
                </div>
                <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>Recruitment & Workforce Solutions</p>
                <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>operations@billzcore.io</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[28px] sm:text-[32px] font-extrabold tracking-tight" style={{ color: "#6366F1" }}>INVOICE</p>
                <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{invoice.invoiceNumber}</p>
                <p className="text-[12px] mt-1" style={{ color: "var(--bz-text-3)" }}>Issued: {invoice.issueDate}</p>
                <p className="text-[12px]" style={{ color: overdue ? "#EF4444" : "var(--bz-text-3)" }}>Due: {invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="px-5 sm:px-8 py-5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--bz-text-3)" }}>Bill To</p>
            <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{invoice.clientName}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{invoice.clientEmail}</p>
            <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{invoice.clientAddress}</p>
          </div>

          {/* Line Items */}
          <div className="px-5 sm:px-8 py-5">
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--bz-border-hard)" }}>
              <div className="hidden sm:grid grid-cols-[1fr_80px_110px_110px] gap-4 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
                <span>Description</span><span className="text-center">Qty</span><span className="text-right">Unit Price</span><span className="text-right">Amount</span>
              </div>
              {invoice.lineItems.map(li => (
                <div key={li.id} className="border-t px-4 py-3" style={{ borderColor: "var(--bz-border-hard)" }}>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{li.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{li.quantity} × {invoice.currency} {li.unitPrice.toLocaleString()}</span>
                      <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{invoice.currency} {li.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-[1fr_80px_110px_110px] gap-4 items-center">
                    <span className="text-[13px]" style={{ color: "var(--bz-text-1)" }}>{li.description}</span>
                    <span className="text-[12.5px] text-center" style={{ color: "var(--bz-text-2)" }}>{li.quantity}</span>
                    <span className="text-[12.5px] text-right" style={{ color: "var(--bz-text-2)" }}>{invoice.currency} {li.unitPrice.toLocaleString()}</span>
                    <span className="text-[13px] font-semibold text-right" style={{ color: "var(--bz-text-1)" }}>{invoice.currency} {li.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 ml-auto max-w-xs space-y-2">
              {[
                { label: "Subtotal", value: `${invoice.currency} ${invoice.subtotal.toLocaleString()}` },
                { label: `Tax (${invoice.taxRate}%)`, value: `${invoice.currency} ${invoice.taxAmount.toLocaleString()}` },
                ...(invoice.discount > 0 ? [{ label: "Discount", value: `- ${invoice.currency} ${invoice.discount.toLocaleString()}` }] : []),
              ].map(r => (
                <div key={r.label} className="flex justify-between text-[12.5px]">
                  <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                  <span style={{ color: "var(--bz-text-2)" }}>{r.value}</span>
                </div>
              ))}
              <div className="border-t pt-2.5 flex justify-between items-center" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>Total</span>
                <span className="text-[18px] font-extrabold" style={{ color: "#6366F1" }}>{invoice.currency} {invoice.total.toLocaleString()}</span>
              </div>
              {invoice.amountPaid > 0 && invoice.status !== "paid" && (
                <>
                  <div className="flex justify-between text-[12.5px]">
                    <span style={{ color: "#10B981" }}>Amount Paid</span>
                    <span style={{ color: "#10B981" }}>{invoice.currency} {invoice.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-bold">
                    <span style={{ color: "#F59E0B" }}>Balance Due</span>
                    <span style={{ color: "#F59E0B" }}>{invoice.currency} {balance.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--bz-text-3)" }}>Notes</p>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--bz-text-2)" }}>{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div className="mt-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--bz-text-3)" }}>Terms</p>
                <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{invoice.terms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Status */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Payment Status</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                {cfg.label}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: "var(--bz-text-3)" }}>Invoice Total</span>
                <span className="font-bold" style={{ color: "var(--bz-text-1)" }}>{invoice.currency} {invoice.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: "var(--bz-text-3)" }}>Amount Paid</span>
                <span className="font-bold" style={{ color: "#10B981" }}>{invoice.currency} {invoice.amountPaid.toLocaleString()}</span>
              </div>
              {invoice.status !== "paid" && (
                <div className="flex justify-between text-[12.5px]">
                  <span style={{ color: "var(--bz-text-3)" }}>Balance Due</span>
                  <span className="font-bold" style={{ color: "#EF4444" }}>{invoice.currency} {balance.toLocaleString()}</span>
                </div>
              )}
            </div>
            {/* Progress bar */}
            {invoice.total > 0 && (
              <div className="mt-3">
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (invoice.amountPaid / invoice.total) * 100)}%`, backgroundColor: "#10B981" }} />
                </div>
                <p className="text-[10.5px] mt-1 text-right" style={{ color: "var(--bz-text-3)" }}>
                  {Math.round((invoice.amountPaid / invoice.total) * 100)}% collected
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Quick Actions</p>
            <div className="space-y-2">
              {invoice.status !== "paid" && (
                <button onClick={() => markAs("paid")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white transition-all" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Mark as Paid
                </button>
              )}
              {invoice.status === "draft" && (
                <button onClick={() => markAs("sent")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white transition-all" style={{ background: "var(--bz-gradient)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send to Client
                </button>
              )}
              <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border transition-all" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Invoice
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border transition-all" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </button>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Details</p>
            {[
              { label: "Account Manager", value: invoice.accountManager },
              { label: "Client", value: invoice.clientName },
              { label: "Issue Date", value: invoice.issueDate },
              { label: "Due Date", value: invoice.dueDate },
              { label: "Currency", value: invoice.currency },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 border-b last:border-b-0 text-[12px]" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                <span className="font-semibold" style={{ color: "var(--bz-text-1)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InvoiceModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        invoice={invoice}
        mode="edit"
      />
    </div>
  );
}
