"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { mockProposals, ProposalStatus, STATUS_CONFIG } from "./proposalTypes";
import ProposalModal from "./proposalModal";

const TABS = ["overview", "pricing", "notes"] as const;
type Tab = typeof TABS[number];

function ProbabilityBar({ value }: { value: number }) {
  const color = value >= 70 ? "#10B981" : value >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[13px] font-extrabold w-10 shrink-0" style={{ color }}>{value}%</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
      <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>{title}</p>
      {children}
    </div>
  );
}

export default function ProposalDetailPage() {
  const params = useParams();
  const [proposals, setProposals] = useState(mockProposals);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const proposal = proposals.find(p => p.id === params?.id);

  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">📋</span>
        <p className="text-[15px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Proposal not found</p>
        <Link href="/dashboard/proposals">
          <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>← Back to Proposals</button>
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[proposal.status];
  const probColor = proposal.probability >= 70 ? "#10B981" : proposal.probability >= 40 ? "#F59E0B" : "#EF4444";

  function markAs(status: ProposalStatus) {
    setProposals(prev => prev.map(p => p.id === proposal!.id ? { ...p, status } : p));
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
    setProposals(prev => prev.map(p => p.id === proposal!.id
      ? { ...p, ...form, lineItems, subtotal, taxAmount, total, taxRate: Number(form.taxRate), discount: Number(form.discount), probability: Number(form.probability) }
      : p));
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--bz-text-3)" }}>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/proposals" className="hover:underline">Proposals</Link>
        <span>/</span>
        <span style={{ color: "var(--bz-text-1)" }}>{proposal.proposalNumber}</span>
      </div>

      {/* Hero */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${probColor},${probColor}88)` }} />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{proposal.proposalNumber}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  {cfg.label}
                </span>
              </div>
              <h1 className="text-[17px] sm:text-[20px] font-extrabold tracking-tight leading-tight" style={{ color: "var(--bz-text-1)" }}>{proposal.title}</h1>
              <p className="text-[13px] font-semibold mt-1" style={{ color: "var(--bz-text-2)" }}>{proposal.clientName}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>
                <span>📅 Issued {proposal.issueDate}</span>
                <span>⏳ Valid until {proposal.validUntil}</span>
                <span>👤 {proposal.accountManager}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end">
              <div className="rounded-xl border px-4 py-3 text-center sm:text-right min-w-[120px]" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
                <p className="text-[18px] sm:text-[20px] font-extrabold" style={{ color: "#6366F1" }}>{proposal.currency} {proposal.total.toLocaleString()}</p>
                <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>Proposal Value</p>
              </div>
              <div className="flex items-center gap-1.5">
                {proposal.status === "draft" && (
                  <button onClick={() => markAs("sent")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>Send</button>
                )}
                {proposal.status === "sent" && (
                  <button onClick={() => markAs("under_review")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "#F59E0B", color: "#F59E0B" }}>Under Review</button>
                )}
                {proposal.status === "under_review" && (
                  <button onClick={() => markAs("accepted")} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>✓ Accept</button>
                )}
                <button onClick={() => setEditOpen(true)} className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Edit</button>
                <button className="px-3 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>PDF</button>
              </div>
            </div>
          </div>

          {/* Probability */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div className="flex justify-between text-[11.5px] mb-1.5" style={{ color: "var(--bz-text-3)" }}>
              <span>Win Probability</span>
              <span className="font-bold" style={{ color: probColor }}>{proposal.probability}%</span>
            </div>
            <ProbabilityBar value={proposal.probability} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t overflow-x-auto px-2 sm:px-5" style={{ borderColor: "var(--bz-border-hard)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 sm:px-4 py-3 text-[12px] sm:text-[12.5px] font-semibold capitalize border-b-2 transition-all shrink-0"
              style={{ borderBottomColor: activeTab === tab ? "#6366F1" : "transparent", color: activeTab === tab ? "#6366F1" : "var(--bz-text-3)" }}>
              {tab === "notes" ? "Notes & Terms" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-4">
            {[
              { title: "Executive Summary", content: proposal.executiveSummary },
              { title: "Scope of Work", content: proposal.scopeOfWork },
              { title: "Deliverables", content: proposal.deliverables },
              { title: "Timeline & Milestones", content: proposal.timeline },
            ].map(sec => (
              <Section key={sec.title} title={sec.title}>
                <p className="text-[13px] leading-relaxed whitespace-pre-line" style={{ color: "var(--bz-text-2)" }}>{sec.content || <span style={{ color: "var(--bz-text-3)" }}>Not specified</span>}</p>
              </Section>
            ))}
          </div>

          <div className="space-y-4">
            {/* Status Progress */}
            <Section title="Proposal Progress">
              <div className="space-y-2.5">
                {(["draft","sent","under_review","accepted"] as ProposalStatus[]).map((s) => {
                  const order = ["draft","sent","under_review","accepted","rejected","expired"];
                  const done = order.indexOf(proposal.status) >= order.indexOf(s);
                  const sc = STATUS_CONFIG[s];
                  return (
                    <div key={s} className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: done ? sc.bg : "var(--bz-bg)", color: done ? sc.color : "var(--bz-text-3)", border: `1.5px solid ${done ? sc.color : "var(--bz-border-hard)"}` }}>
                        {done ? "✓" : "·"}
                      </div>
                      <span className="text-[12px] font-semibold" style={{ color: done ? sc.color : "var(--bz-text-3)" }}>{sc.label}</span>
                    </div>
                  );
                })}
                {proposal.status === "rejected" && (
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: STATUS_CONFIG.rejected.bg, color: STATUS_CONFIG.rejected.color, border: `1.5px solid ${STATUS_CONFIG.rejected.color}` }}>✗</div>
                    <span className="text-[12px] font-semibold" style={{ color: STATUS_CONFIG.rejected.color }}>Rejected</span>
                  </div>
                )}
              </div>
            </Section>

            {/* Quick Actions */}
            <Section title="Quick Actions">
              <div className="space-y-2">
                {proposal.status === "draft" && (
                  <button onClick={() => markAs("sent")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send to Client
                  </button>
                )}
                {proposal.status === "sent" && (
                  <button onClick={() => markAs("under_review")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "#F59E0B", color: "#F59E0B" }}>
                    Mark Under Review
                  </button>
                )}
                {proposal.status === "under_review" && (
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
                <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Proposal
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </button>
              </div>
            </Section>

            {/* Client info */}
            <Section title="Client">
              <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{proposal.clientName}</p>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{proposal.clientEmail}</p>
              <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{proposal.clientAddress}</p>
            </Section>
          </div>
        </div>
      )}

      {/* Tab: Pricing */}
      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--bz-text-3)" }}>Pricing Breakdown</p>
            </div>
            <div className="hidden sm:grid grid-cols-[1fr_80px_110px_110px] gap-4 px-5 py-2.5 text-[10.5px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)", borderBottom: "1px solid var(--bz-border-hard)" }}>
              <span>Service / Description</span><span className="text-center">Qty</span><span className="text-right">Unit Price</span><span className="text-right">Amount</span>
            </div>
            {proposal.lineItems.map(li => (
              <div key={li.id} className="border-t px-5 py-3.5" style={{ borderColor: "var(--bz-border-hard)" }}>
                <div className="sm:hidden">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{li.description}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{li.quantity} × {proposal.currency} {li.unitPrice.toLocaleString()}</span>
                    <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{proposal.currency} {li.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="hidden sm:grid grid-cols-[1fr_80px_110px_110px] gap-4 items-center">
                  <span className="text-[13px]" style={{ color: "var(--bz-text-1)" }}>{li.description}</span>
                  <span className="text-[12.5px] text-center" style={{ color: "var(--bz-text-2)" }}>{li.quantity}</span>
                  <span className="text-[12.5px] text-right" style={{ color: "var(--bz-text-2)" }}>{proposal.currency} {li.unitPrice.toLocaleString()}</span>
                  <span className="text-[13px] font-semibold text-right" style={{ color: "var(--bz-text-1)" }}>{proposal.currency} {li.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {/* Totals */}
            <div className="px-5 pb-5 mt-2">
              <div className="ml-auto max-w-xs space-y-2">
                {[
                  { label: "Subtotal", value: `${proposal.currency} ${proposal.subtotal.toLocaleString()}` },
                  { label: `Tax (${proposal.taxRate}%)`, value: `${proposal.currency} ${proposal.taxAmount.toLocaleString()}` },
                  ...(proposal.discount > 0 ? [{ label: "Discount", value: `- ${proposal.currency} ${proposal.discount.toLocaleString()}` }] : []),
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-[12.5px]">
                    <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                    <span style={{ color: "var(--bz-text-2)" }}>{r.value}</span>
                  </div>
                ))}
                <div className="border-t pt-2.5 flex justify-between items-center" style={{ borderColor: "var(--bz-border-hard)" }}>
                  <span className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>Proposal Total</span>
                  <span className="text-[18px] font-extrabold" style={{ color: "#6366F1" }}>{proposal.currency} {proposal.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Financial Summary</p>
            {[
              { label: "Total Value", value: `${proposal.currency} ${proposal.total.toLocaleString()}`, color: "#6366F1" },
              { label: "Weighted Value", value: `${proposal.currency} ${Math.round(proposal.total * proposal.probability / 100).toLocaleString()}`, color: "#10B981" },
              { label: "Win Probability", value: `${proposal.probability}%`, color: probColor },
              { label: "Line Items", value: String(proposal.lineItems.length), color: "var(--bz-text-2)" },
              { label: "Tax Rate", value: `${proposal.taxRate}%`, color: "var(--bz-text-2)" },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                <span className="text-[12.5px] font-bold" style={{ color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Section title="Internal Notes">
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--bz-text-2)" }}>
              {proposal.notes || <span style={{ color: "var(--bz-text-3)" }}>No internal notes added.</span>}
            </p>
          </Section>
          <Section title="Terms & Conditions">
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--bz-text-2)" }}>
              {proposal.terms || <span style={{ color: "var(--bz-text-3)" }}>No terms specified.</span>}
            </p>
          </Section>
        </div>
      )}

      <ProposalModal open={editOpen} onClose={() => setEditOpen(false)} onSave={handleSave} proposal={proposal} mode="edit" />
    </div>
  );
}
