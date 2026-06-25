"use client";

import { useState, useEffect } from "react";
import { Quotation, QuotationStatus } from "./quotationTypes";
import { mockClients } from "@/features/clients/clientTypes";

type FormData = {
  clientId: string; quoteNumber: string; issueDate: string; validUntil: string;
  currency: string; taxRate: string; discount: string; notes: string; terms: string;
  status: QuotationStatus;
  lineItems: { description: string; quantity: string; unitPrice: string }[];
};

const emptyForm: FormData = {
  clientId: "", quoteNumber: "", issueDate: new Date().toISOString().split("T")[0],
  validUntil: "", currency: "AED", taxRate: "5", discount: "0",
  notes: "", terms: "This quotation is valid until the date specified above.",
  status: "draft", lineItems: [{ description: "", quantity: "1", unitPrice: "" }],
};

function quoteToForm(q: Quotation): FormData {
  return {
    clientId: q.clientId, quoteNumber: q.quoteNumber, issueDate: q.issueDate,
    validUntil: q.validUntil, currency: q.currency, taxRate: String(q.taxRate),
    discount: String(q.discount), notes: q.notes || "", terms: q.terms || "",
    status: q.status,
    lineItems: q.lineItems.map(li => ({ description: li.description, quantity: String(li.quantity), unitPrice: String(li.unitPrice) })),
  };
}

const cls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none border transition-all focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const sty = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };
function Lbl({ t }: { t: string }) {
  return <label className="block text-[10.5px] font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{t}</label>;
}

interface Props { open: boolean; onClose: () => void; onSave: (d: FormData) => void; quotation?: Quotation | null; mode: "add" | "edit"; }

export default function QuotationModal({ open, onClose, onSave, quotation, mode }: Props) {
  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => { if (open) setForm(quotation ? quoteToForm(quotation) : emptyForm); }, [open, quotation]);

  if (!open) return null;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const setItem = (i: number, k: keyof typeof form.lineItems[0], v: string) =>
    setForm(f => ({ ...f, lineItems: f.lineItems.map((li, idx) => idx === i ? { ...li, [k]: v } : li) }));
  const addItem = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: "", quantity: "1", unitPrice: "" }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }));

  const subtotal = form.lineItems.reduce((s, li) => s + (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0), 0);
  const taxAmt = subtotal * (Number(form.taxRate) || 0) / 100;
  const total = subtotal + taxAmt - (Number(form.discount) || 0);
  const selectedClient = mockClients.find(c => c.id === form.clientId);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-3xl rounded-2xl border shadow-2xl flex flex-col" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", maxHeight: "92vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <div>
            <h2 className="text-[15px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>
              {mode === "add" ? "Create Quotation" : `Edit ${quotation?.quoteNumber}`}
            </h2>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Fill in the details to generate a quote</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(0,0,0,0.05)]" style={{ color: "var(--bz-text-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
          {/* Client + Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Lbl t="Client *" />
              <select className={cls} style={sty} value={form.clientId} onChange={set("clientId")}>
                <option value="">Select client…</option>
                {mockClients.map(c => <option key={c.id} value={c.id}>{c.companyName} ({c.code})</option>)}
              </select>
              {selectedClient && <p className="mt-1 text-[11px]" style={{ color: "var(--bz-text-3)" }}>{selectedClient.contactEmail} · {selectedClient.city}, {selectedClient.country}</p>}
            </div>
            <div><Lbl t="Quote Number *" /><input className={cls} style={sty} value={form.quoteNumber} onChange={set("quoteNumber")} placeholder="QT-0001" /></div>
            <div>
              <Lbl t="Status" />
              <select className={cls} style={sty} value={form.status} onChange={set("status")}>
                {(["draft","sent","accepted","rejected","expired"] as QuotationStatus[]).map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Lbl t="Services & Items" />
              <button onClick={addItem} className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg" style={{ color: "#6366F1", backgroundColor: "rgba(99,102,241,0.08)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Line
              </button>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--bz-border-hard)" }}>
              <div className="hidden sm:grid grid-cols-[1fr_80px_100px_90px_32px] gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
                <span>Description</span><span>Qty</span><span>Unit Price</span><span className="text-right">Amount</span><span />
              </div>
              {form.lineItems.map((li, i) => {
                const amt = (Number(li.quantity) || 0) * (Number(li.unitPrice) || 0);
                return (
                  <div key={i} className="border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                    <div className="sm:hidden p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold" style={{ color: "var(--bz-text-3)" }}>Item {i + 1}</span>
                        {form.lineItems.length > 1 && (
                          <button onClick={() => removeItem(i)} className="h-6 w-6 flex items-center justify-center rounded" style={{ color: "#EF4444" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>
                      <input className={cls} style={sty} placeholder="Service description" value={li.description} onChange={e => setItem(i, "description", e.target.value)} />
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

          {/* Summary + Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Lbl t="Tax %" /><input className={cls} style={sty} type="number" value={form.taxRate} onChange={set("taxRate")} placeholder="5" /></div>
                <div><Lbl t={`Discount (${form.currency})`} /><input className={cls} style={sty} type="number" value={form.discount} onChange={set("discount")} placeholder="0" /></div>
              </div>
              <div>
                <Lbl t="Notes" />
                <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 resize-none"
                  style={sty} rows={3} value={form.notes} onChange={set("notes")} placeholder="Additional notes for the client…" />
              </div>
            </div>
            <div className="rounded-xl border p-4 space-y-2.5 self-start" style={{ backgroundColor: "rgba(99,102,241,0.03)", borderColor: "rgba(99,102,241,0.2)" }}>
              <p className="text-[11.5px] font-bold" style={{ color: "#6366F1" }}>Quote Summary</p>
              {[
                { l: "Subtotal", v: `${form.currency} ${subtotal.toLocaleString()}` },
                { l: `Tax (${form.taxRate || 0}%)`, v: `${form.currency} ${Math.round(taxAmt).toLocaleString()}` },
                { l: "Discount", v: `- ${form.currency} ${Number(form.discount || 0).toLocaleString()}` },
              ].map(r => (
                <div key={r.l} className="flex justify-between text-[12.5px]">
                  <span style={{ color: "var(--bz-text-3)" }}>{r.l}</span>
                  <span style={{ color: "var(--bz-text-2)" }}>{r.v}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
                <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Quote Total</span>
                <span className="text-[15px] font-extrabold" style={{ color: "#6366F1" }}>{form.currency} {Math.round(total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold border"
            style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>Cancel</button>
          <div className="flex items-center gap-2">
            <button onClick={() => { onSave({ ...form, status: "draft" }); onClose(); }} className="px-4 py-2 rounded-lg text-[13px] font-semibold border"
              style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>Save Draft</button>
            <button onClick={() => { onSave(form); onClose(); }} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white"
              style={{ background: "var(--bz-gradient)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              {mode === "add" ? "Create Quote" : "Update Quote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
