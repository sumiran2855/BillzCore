"use client";

import { useState, useEffect } from "react";
import { Client, ClientStatus, INDUSTRIES, CLIENT_SOURCES } from "./clientTypes";

type FormData = {
  companyName: string; industry: string; country: string; city: string;
  address: string; website: string; status: ClientStatus;
  contactName: string; contactRole: string; contactEmail: string; contactPhone: string;
  currency: string; accountManager: string; notes: string;
  contractStart: string; contractEnd: string;
};

const empty: FormData = {
  companyName: "", industry: "Construction", country: "", city: "",
  address: "", website: "", status: "prospect",
  contactName: "", contactRole: "", contactEmail: "", contactPhone: "",
  currency: "AED", accountManager: "", notes: "",
  contractStart: "", contractEnd: "",
};

function clientToForm(c: Client): FormData {
  return {
    companyName: c.companyName, industry: c.industry, country: c.country,
    city: c.city, address: c.address, website: c.website || "",
    status: c.status, contactName: c.contactName, contactRole: c.contactRole,
    contactEmail: c.contactEmail, contactPhone: c.contactPhone,
    currency: c.currency, accountManager: c.accountManager, notes: c.notes || "",
    contractStart: c.contractStart, contractEnd: c.contractEnd || "",
  };
}

const inputCls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none border transition-all focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const inputStyle = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold mb-1" style={{ color: "var(--bz-text-2)" }}>{label}</label>
      {children}
    </div>
  );
}

interface Props { open: boolean; onClose: () => void; onSave: (d: FormData) => void; client?: Client | null; mode: "add" | "edit"; }

const STEPS = [{ id: 1, label: "Company", icon: "🏢" }, { id: 2, label: "Contract", icon: "📄" }, { id: 3, label: "Review", icon: "✅" }];

export default function ClientModal({ open, onClose, onSave, client, mode }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(empty);

  useEffect(() => {
    if (open) { setStep(1); setForm(client ? clientToForm(client) : empty); }
  }, [open, client]);

  if (!open) return null;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-xl rounded-2xl border shadow-2xl flex flex-col" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <div>
            <h2 className="text-[15px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>
              {mode === "add" ? "Add New Client" : `Edit — ${client?.companyName}`}
            </h2>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(0,0,0,0.05)]" style={{ color: "var(--bz-text-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b shrink-0 overflow-x-auto" style={{ borderColor: "var(--bz-border-hard)" }}>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Company Name *">
                  <input className={inputCls} style={inputStyle} value={form.companyName} onChange={set("companyName")} placeholder="Acme Corp" />
                </Field>
              </div>
              <Field label="Industry">
                <select className={inputCls} style={inputStyle} value={form.industry} onChange={set("industry")}>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={inputCls} style={inputStyle} value={form.status} onChange={set("status")}>
                  {(["active","inactive","prospect","onboarding","churned"] as ClientStatus[]).map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Country">
                <input className={inputCls} style={inputStyle} value={form.country} onChange={set("country")} placeholder="UAE" />
              </Field>
              <Field label="City">
                <input className={inputCls} style={inputStyle} value={form.city} onChange={set("city")} placeholder="Dubai" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address">
                  <input className={inputCls} style={inputStyle} value={form.address} onChange={set("address")} placeholder="Full address" />
                </Field>
              </div>
              <Field label="Website">
                <input className={inputCls} style={inputStyle} value={form.website} onChange={set("website")} placeholder="https://company.com" />
              </Field>
              <Field label="Currency">
                <select className={inputCls} style={inputStyle} value={form.currency} onChange={set("currency")}>
                  {["AED","INR","SAR","OMR","MVR","KWD","BHD","USD"].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Primary Contact Name *">
                <input className={inputCls} style={inputStyle} value={form.contactName} onChange={set("contactName")} placeholder="John Smith" />
              </Field>
              <Field label="Contact Role">
                <input className={inputCls} style={inputStyle} value={form.contactRole} onChange={set("contactRole")} placeholder="HR Director" />
              </Field>
              <Field label="Contact Email *">
                <input className={inputCls} style={inputStyle} type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="hr@company.com" />
              </Field>
              <Field label="Contact Phone">
                <input className={inputCls} style={inputStyle} value={form.contactPhone} onChange={set("contactPhone")} placeholder="+971-50-000-0000" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Contract Start">
                <input className={inputCls} style={inputStyle} type="date" value={form.contractStart} onChange={set("contractStart")} />
              </Field>
              <Field label="Contract End (optional)">
                <input className={inputCls} style={inputStyle} type="date" value={form.contractEnd} onChange={set("contractEnd")} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Account Manager">
                  <input className={inputCls} style={inputStyle} value={form.accountManager} onChange={set("accountManager")} placeholder="Arjun Kumar" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes">
                  <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none"
                    style={inputStyle} rows={4} value={form.notes} onChange={set("notes")} placeholder="Internal notes about this client..." />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Review before saving</p>
              {[
                { title: "Company", items: [["Company", form.companyName], ["Industry", form.industry], ["Country", form.country + (form.city ? ", " + form.city : "")], ["Website", form.website || "—"]] },
                { title: "Primary Contact", items: [["Name", form.contactName], ["Role", form.contactRole], ["Email", form.contactEmail], ["Phone", form.contactPhone]] },
                { title: "Contract", items: [["Start", form.contractStart || "—"], ["End", form.contractEnd || "Open-ended"], ["Manager", form.accountManager], ["Status", form.status]] },
              ].map(sec => (
                <div key={sec.title} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
                  <p className="text-[12px] font-bold mb-2" style={{ color: "#6366F1" }}>{sec.title}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4">
                    {sec.items.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{k}</span>
                        <span className="text-[12px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
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
            <button onClick={() => setStep(s => s + 1)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white"
              style={{ background: "var(--bz-gradient)" }}>
              Next
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ) : (
            <button onClick={() => { onSave(form); onClose(); }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              {mode === "add" ? "Save Client" : "Update Client"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
