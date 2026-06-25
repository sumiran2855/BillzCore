"use client";

import { useState, useEffect } from "react";
import { Proposal, ProposalStatus } from "./proposalTypes";
import { mockClients } from "@/features/clients/clientTypes";

type LineItem = { description: string; quantity: string; unitPrice: string };
type FormData = {
  clientId: string; proposalNumber: string; title: string;
  issueDate: string; validUntil: string; currency: string;
  taxRate: string; discount: string; probability: string;
  executiveSummary: string; scopeOfWork: string; deliverables: string; timeline: string;
  notes: string; terms: string; status: ProposalStatus;
  lineItems: LineItem[];
};

const empty: FormData = {
  clientId: "", proposalNumber: "", title: "",
  issueDate: new Date().toISOString().split("T")[0], validUntil: "",
  currency: "AED", taxRate: "5", discount: "0", probability: "50",
  executiveSummary: "", scopeOfWork: "", deliverables: "", timeline: "",
  notes: "", terms: "This proposal is valid until the date specified. Services commence upon signed agreement.", status: "draft",
  lineItems: [{ description: "", quantity: "1", unitPrice: "" }],
};

function toForm(p: Proposal): FormData {
  return {
    clientId: p.clientId, proposalNumber: p.proposalNumber, title: p.title,
    issueDate: p.issueDate, validUntil: p.validUntil, currency: p.currency,
    taxRate: String(p.taxRate), discount: String(p.discount), probability: String(p.probability),
    executiveSummary: p.executiveSummary, scopeOfWork: p.scopeOfWork,
    deliverables: p.deliverables, timeline: p.timeline,
    notes: p.notes || "", terms: p.terms || "", status: p.status,
    lineItems: p.lineItems.map(li => ({ description: li.description, quantity: String(li.quantity), unitPrice: String(li.unitPrice) })),
  };
}

const cls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none border transition-all focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const areaCls = "w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none";
const sty = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };
function Lbl({ t }: { t: string }) {
  return <label className="block text-[10.5px] font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{t}</label>;
}

const STEPS = [{ id: 1, icon: "📋", label: "Details" }, { id: 2, icon: "📝", label: "Content" }, { id: 3, icon: "💰", label: "Pricing" }];

interface Props { open: boolean; onClose: () => void; onSave: (d: FormData) => void; proposal?: Proposal | null; mode: "add" | "edit"; }

export default function ProposalModal({ open, onClose, onSave, proposal, mode }: Props) {
  const [form, setForm] = useState<FormData>(empty);
  const [step, setStep] = useState(1);

  useEffect(() => { if (open) { setStep(1); setForm(proposal ? toForm(proposal) : empty); } }, [open, proposal]);
  if (!open) return null;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const setItem = (i: number, k: keyof LineItem, v: string) =>
    setForm(f => ({ ...f, lineItems: f.lineItems.map((li, idx) => idx === i ? { ...li, [k]: v } : li) }));
  const addItem = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: "", quantity: "1", unitPrice: "" }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }));

  const subtotal = form.lineItems.reduce((s, li) => s + (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0), 0);
  const taxAmt = subtotal * (Number(form.taxRate) || 0) / 100;
  const total = subtotal + taxAmt - (Number(form.discount) || 0);
  const selectedClient = mockClients.find(c => c.id === form.clientId);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-3xl rounded-2xl border shadow-2xl flex flex-col" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", maxHeight: "93vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <div>
            <h2 className="text-[15px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>
              {mode === "add" ? "Create Proposal" : `Edit ${proposal?.proposalNumber}`}
            </h2>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(0,0,0,0.05)]" style={{ color: "var(--bz-text-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-1 px-5 sm:px-6 py-3 border-b shrink-0 overflow-x-auto" style={{ borderColor: "var(--bz-border-hard)" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 shrink-0">
              <button onClick={() => setStep(s.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
                style={{ backgroundColor: step === s.id ? "rgba(99,102,241,0.12)" : "transparent", color: step === s.id ? "#6366F1" : step > s.id ? "#10B981" : "var(--bz-text-3)" }}>
                <span>{step > s.id ? "✓" : s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className="w-4 h-px mx-1 shrink-0" style={{ backgroundColor: "var(--bz-border-hard)" }} />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Lbl t="Proposal Title *" />
                <input className={cls} style={sty} value={form.title} onChange={set("title")} placeholder="e.g. Engineering Workforce Supply — Q3 2026" />
              </div>
              <div className="sm:col-span-2">
                <Lbl t="Client *" />
                <select className={cls} style={sty} value={form.clientId} onChange={set("clientId")}>
                  <option value="">Select client…</option>
                  {mockClients.map(c => <option key={c.id} value={c.id}>{c.companyName} ({c.code})</option>)}
                </select>
                {selectedClient && <p className="mt-1 text-[11px]" style={{ color: "var(--bz-text-3)" }}>{selectedClient.contactEmail} · {selectedClient.city}, {selectedClient.country}</p>}
              </div>
              <div><Lbl t="Proposal Number *" /><input className={cls} style={sty} value={form.proposalNumber} onChange={set("proposalNumber")} placeholder="PR-0001" /></div>
              <div>
                <Lbl t="Status" />
                <select className={cls} style={sty} value={form.status} onChange={set("status")}>
                  {(["draft","sent","under_review","accepted","rejected","expired"] as ProposalStatus[]).map(s => (
                    <option key={s} value={s}>{s === "under_review" ? "Under Review" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div><Lbl t="Issue Date *" /><input className={cls} style={sty} type="date" value={form.issueDate} onChange={set("issueDate")} /></div>
              <div><Lbl t="Valid Until *" /><input className={cls} style={sty} type="date" value={form.validUntil} onChange={set("validUntil")} /></div>
              <div>
                <Lbl t="Currency" />
                <select className={cls} style={sty} value={form.currency} onChange={set("currency")}>
                  {["AED","INR","SAR","OMR","MVR","KWD","BHD","USD"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Lbl t="Win Probability (%)" />
                <div className="space-y-1">
                  <input type="range" min="0" max="100" step="5" value={form.probability} onChange={set("probability")} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ accentColor: "#6366F1" }} />
                  <div className="flex justify-between text-[11px]" style={{ color: "var(--bz-text-3)" }}>
                    <span>0%</span>
                    <span className="font-bold" style={{ color: "#6366F1" }}>{form.probability}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Content */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Lbl t="Executive Summary" />
                <textarea className={areaCls} style={sty} rows={4} value={form.executiveSummary} onChange={set("executiveSummary")} placeholder="Briefly describe the value proposition and objectives of this proposal…" />
              </div>
              <div>
                <Lbl t="Scope of Work" />
                <textarea className={areaCls} style={sty} rows={4} value={form.scopeOfWork} onChange={set("scopeOfWork")} placeholder="Detail the services, activities, and boundaries of this engagement…" />
              </div>
              <div>
                <Lbl t="Deliverables" />
                <textarea className={areaCls} style={sty} rows={3} value={form.deliverables} onChange={set("deliverables")} placeholder="• Shortlisted profiles&#10;• Interview coordination&#10;• Onboarding support" />
              </div>
              <div>
                <Lbl t="Timeline / Milestones" />
                <textarea className={areaCls} style={sty} rows={3} value={form.timeline} onChange={set("timeline")} placeholder="Week 1–2: Sourcing&#10;Week 3–4: Interviews&#10;Week 5–6: Onboarding" />
              </div>
              <div>
                <Lbl t="Internal Notes" />
                <textarea className={areaCls} style={sty} rows={2} value={form.notes} onChange={set("notes")} placeholder="Internal notes (not shown to client)…" />
              </div>
            </div>
          )}

          {/* Step 3 — Pricing */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Lbl t="Pricing Breakdown" />
                  <button onClick={addItem} className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg" style={{ color: "#6366F1", backgroundColor: "rgba(99,102,241,0.08)" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Item
                  </button>
                </div>
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--bz-border-hard)" }}>
                  <div className="hidden sm:grid grid-cols-[1fr_80px_100px_90px_32px] gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
                    <span>Service / Description</span><span>Qty</span><span>Unit Price</span><span className="text-right">Amount</span><span />
                  </div>
                  {form.lineItems.map((li, i) => {
                    const amt = (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0);
                    return (
                      <div key={i} className="border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                        <div className="sm:hidden p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-semibold" style={{ color: "var(--bz-text-3)" }}>Item {i + 1}</span>
                            {form.lineItems.length > 1 && <button onClick={() => removeItem(i)} className="h-6 w-6 flex items-center justify-center rounded" style={{ color: "#EF4444" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
                          </div>
                          <input className={cls} style={sty} placeholder="Description" value={li.description} onChange={e => setItem(i, "description", e.target.value)} />
                          <div className="grid grid-cols-3 gap-2">
                            <input className={cls} style={sty} placeholder="Qty" type="number" value={li.quantity} onChange={e => setItem(i, "quantity", e.target.value)} />
                            <input className={cls} style={sty} placeholder="Price" type="number" value={li.unitPrice} onChange={e => setItem(i, "unitPrice", e.target.value)} />
                            <div className="flex h-9 items-center justify-end px-2 text-[12px] font-bold rounded-lg" style={{ backgroundColor: "var(--bz-bg)", border: "1px solid var(--bz-border-hard)", color: "var(--bz-text-1)" }}>{amt.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="hidden sm:grid grid-cols-[1fr_80px_100px_90px_32px] gap-3 px-3 py-2 items-center">
                          <input className={cls} style={sty} placeholder="Service description…" value={li.description} onChange={e => setItem(i, "description", e.target.value)} />
                          <input className={cls} style={sty} type="number" value={li.quantity} onChange={e => setItem(i, "quantity", e.target.value)} />
                          <input className={cls} style={sty} type="number" placeholder="0.00" value={li.unitPrice} onChange={e => setItem(i, "unitPrice", e.target.value)} />
                          <p className="text-[12.5px] font-bold text-right" style={{ color: "var(--bz-text-1)" }}>{form.currency} {amt.toLocaleString()}</p>
                          {form.lineItems.length > 1
                            ? <button onClick={() => removeItem(i)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(239,68,68,0.08)]" style={{ color: "#EF4444" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                            : <div />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Lbl t="Tax %" /><input className={cls} style={sty} type="number" value={form.taxRate} onChange={set("taxRate")} /></div>
                  <div><Lbl t={`Discount (${form.currency})`} /><input className={cls} style={sty} type="number" value={form.discount} onChange={set("discount")} /></div>
                </div>
                <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: "rgba(99,102,241,0.03)", borderColor: "rgba(99,102,241,0.2)" }}>
                  <p className="text-[11px] font-bold" style={{ color: "#6366F1" }}>Proposal Value</p>
                  {[
                    { l: "Subtotal", v: `${form.currency} ${subtotal.toLocaleString()}` },
                    { l: `Tax (${form.taxRate || 0}%)`, v: `${form.currency} ${Math.round(taxAmt).toLocaleString()}` },
                    { l: "Discount", v: `- ${form.currency} ${Number(form.discount || 0).toLocaleString()}` },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between text-[12px]">
                      <span style={{ color: "var(--bz-text-3)" }}>{r.l}</span>
                      <span style={{ color: "var(--bz-text-2)" }}>{r.v}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
                    <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Total</span>
                    <span className="text-[15px] font-extrabold" style={{ color: "#6366F1" }}>{form.currency} {Math.round(total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <button onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border"
            style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex items-center gap-1">
            {STEPS.map(s => (
              <div key={s.id} className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: step === s.id ? "20px" : "6px", backgroundColor: step >= s.id ? "#6366F1" : "var(--bz-border-hard)" }} />
            ))}
          </div>
          {step < STEPS.length ? (
            <button onClick={() => setStep(s => s + 1)} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
              Next <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => { onSave({ ...form, status: "draft" }); onClose(); }} className="px-4 py-2 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>
                Save Draft
              </button>
              <button onClick={() => { onSave(form); onClose(); }} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                {mode === "add" ? "Create Proposal" : "Update Proposal"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
