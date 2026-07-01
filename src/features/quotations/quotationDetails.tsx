"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { mockQuotations, QuotationStatus, STATUS_CONFIG } from "./quotationTypes";
import QuotationModal from "./quotationModal";

export default function QuotationDetailPage() {
  const params = useParams();
  const [quotations, setQuotations] = useState(mockQuotations);
  const [editOpen, setEditOpen] = useState(false);

  const quote = quotations.find(q => q.id === params?.id);

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">📋</span>
        <p className="text-[15px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Quotation not found</p>
        <Link href="/dashboard/quotations">
          <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>← Back to Quotations</button>
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[quote.status];
  const isExpired = quote.status !== "accepted" && quote.status !== "converted" && new Date(quote.validUntil) < new Date();

  function markAs(status: QuotationStatus) {
    setQuotations(prev => prev.map(q => q.id === quote!.id ? { ...q, status } : q));
  }

  function handleSave(form: any) {
    const lineItems = form.lineItems.map((li: any, i: number) => ({
      id: String(i + 1), description: li.description,
      quantity: Number(li.quantity), unitPrice: Number(li.unitPrice),
      amount: Number(li.quantity) * Number(li.unitPrice),
    }));
    const subtotal = lineItems.reduce((s: number, li: any) => s + li.amount, 0);
    const taxAmount = Math.round(subtotal * Number(form.taxRate) / 100);
    const total = subtotal + taxAmount - Number(form.discount);
    setQuotations(prev => prev.map(q => q.id === quote!.id
      ? { ...q, ...form, lineItems, subtotal, taxAmount, total, taxRate: Number(form.taxRate), discount: Number(form.discount) }
      : q));
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--bz-text-3)" }}>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/quotations" className="hover:underline">Quotations</Link>
        <span>/</span>
        <span style={{ color: "var(--bz-text-1)" }}>{quote.quoteNumber}</span>
      </div>

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[20px] sm:text-[22px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{quote.quoteNumber}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />{cfg.label}
          </span>
          {isExpired && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}>Expired</span>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {quote.status === "draft" && (
            <button onClick={() => markAs("sent")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
              Send to Client
            </button>
          )}
          {quote.status === "sent" && (
            <>
              <button onClick={() => markAs("accepted")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                ✓ Mark Accepted
              </button>
              <button onClick={() => markAs("rejected")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                ✗ Mark Rejected
              </button>
            </>
          )}
          {quote.status === "accepted" && (
            <button onClick={() => markAs("converted")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#8B5CF6,#6366F1)" }}>
              Convert to Invoice
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
        {/* Quote Document */}
        <div className="xl:col-span-2 rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          {/* Header */}
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
                <p className="text-[28px] sm:text-[32px] font-extrabold tracking-tight" style={{ color: "#8B5CF6" }}>QUOTATION</p>
                <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{quote.quoteNumber}</p>
                <p className="text-[12px] mt-1" style={{ color: "var(--bz-text-3)" }}>Issued: {quote.issueDate}</p>
                <p className="text-[12px]" style={{ color: isExpired ? "#EF4444" : "var(--bz-text-3)" }}>Valid Until: {quote.validUntil}</p>
              </div>
            </div>
          </div>

          {/* Prepared For */}
          <div className="px-5 sm:px-8 py-5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--bz-text-3)" }}>Prepared For</p>
            <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{quote.clientName}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{quote.clientEmail}</p>
            <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{quote.clientAddress}</p>
          </div>

          {/* Line Items */}
          <div className="px-5 sm:px-8 py-5">
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--bz-border-hard)" }}>
              <div className="hidden sm:grid grid-cols-[1fr_80px_110px_110px] gap-4 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
                <span>Service / Description</span><span className="text-center">Qty</span><span className="text-right">Unit Price</span><span className="text-right">Amount</span>
              </div>
              {quote.lineItems.map(li => (
                <div key={li.id} className="border-t px-4 py-3" style={{ borderColor: "var(--bz-border-hard)" }}>
                  <div className="sm:hidden">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{li.description}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{li.quantity} × {quote.currency} {li.unitPrice.toLocaleString()}</span>
                      <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{quote.currency} {li.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="hidden sm:grid grid-cols-[1fr_80px_110px_110px] gap-4 items-center">
                    <span className="text-[13px]" style={{ color: "var(--bz-text-1)" }}>{li.description}</span>
                    <span className="text-[12.5px] text-center" style={{ color: "var(--bz-text-2)" }}>{li.quantity}</span>
                    <span className="text-[12.5px] text-right" style={{ color: "var(--bz-text-2)" }}>{quote.currency} {li.unitPrice.toLocaleString()}</span>
                    <span className="text-[13px] font-semibold text-right" style={{ color: "var(--bz-text-1)" }}>{quote.currency} {li.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 ml-auto max-w-xs space-y-2">
              {[
                { label: "Subtotal", value: `${quote.currency} ${quote.subtotal.toLocaleString()}` },
                { label: `Tax (${quote.taxRate}%)`, value: `${quote.currency} ${quote.taxAmount.toLocaleString()}` },
                ...(quote.discount > 0 ? [{ label: "Discount", value: `- ${quote.currency} ${quote.discount.toLocaleString()}` }] : []),
              ].map(r => (
                <div key={r.label} className="flex justify-between text-[12.5px]">
                  <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                  <span style={{ color: "var(--bz-text-2)" }}>{r.value}</span>
                </div>
              ))}
              <div className="border-t pt-2.5 flex justify-between items-center" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>Quote Total</span>
                <span className="text-[18px] font-extrabold" style={{ color: "#8B5CF6" }}>{quote.currency} {quote.total.toLocaleString()}</span>
              </div>
            </div>

            {quote.notes && (
              <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--bz-text-3)" }}>Notes</p>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--bz-text-2)" }}>{quote.notes}</p>
              </div>
            )}
            {quote.terms && (
              <div className="mt-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--bz-text-3)" }}>Terms & Conditions</p>
                <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{quote.terms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status card */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Quote Status</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                {cfg.label}
              </span>
            </div>
            {/* Status timeline */}
            <div className="space-y-2">
              {(["draft", "sent", "accepted", "converted"] as QuotationStatus[]).map((s, i) => {
                const done = ["draft","sent","accepted","converted"].indexOf(quote.status) >= i;
                const sc = STATUS_CONFIG[s];
                return (
                  <div key={s} className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: done ? sc.bg : "var(--bz-bg)", color: done ? sc.color : "var(--bz-text-3)", border: `1.5px solid ${done ? sc.color : "var(--bz-border-hard)"}` }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: done ? sc.color : "var(--bz-text-3)" }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Quick Actions</p>
            <div className="space-y-2">
              {quote.status === "draft" && (
                <button onClick={() => markAs("sent")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send to Client
                </button>
              )}
              {quote.status === "sent" && (
                <>
                  <button onClick={() => markAs("accepted")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Mark as Accepted
                  </button>
                  <button onClick={() => markAs("rejected")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                    Mark as Rejected
                  </button>
                </>
              )}
              {quote.status === "accepted" && (
                <button onClick={() => markAs("converted")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#8B5CF6,#6366F1)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  Convert to Invoice
                </button>
              )}
              <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Quotation
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download PDF
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Details</p>
            {[
              { label: "Account Manager", value: quote.accountManager },
              { label: "Client", value: quote.clientName },
              { label: "Issue Date", value: quote.issueDate },
              { label: "Valid Until", value: quote.validUntil },
              { label: "Currency", value: quote.currency },
              { label: "Quote Total", value: `${quote.currency} ${quote.total.toLocaleString()}` },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2 border-b last:border-b-0 text-[12px]" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                <span className="font-semibold" style={{ color: "var(--bz-text-1)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuotationModal open={editOpen} onClose={() => setEditOpen(false)} onSave={handleSave} quotation={quote} mode="edit" />
    </div>
  );
}
