"use client";

import { useState, useEffect } from "react";
import { Job, JobStatus, JobType, JobPriority, STATUS_CONFIG, PRIORITY_CONFIG, JOB_TYPE_LABELS } from "./jobTypes";
import { mockClients } from "@/features/clients/clientTypes";

type FormData = {
  title: string; clientId: string; department: string; location: string; country: string;
  jobType: JobType; status: JobStatus; priority: JobPriority;
  vacancies: string; salaryMin: string; salaryMax: string; currency: string;
  assignedTo: string; deadline: string; description: string; requirements: string;
  tags: string;
};

const empty: FormData = {
  title: "", clientId: "", department: "", location: "", country: "",
  jobType: "permanent", status: "open", priority: "medium",
  vacancies: "1", salaryMin: "", salaryMax: "", currency: "AED",
  assignedTo: "", deadline: "", description: "", requirements: "", tags: "",
};

function toForm(j: Job): FormData {
  return {
    title: j.title, clientId: j.clientId, department: j.department,
    location: j.location, country: j.country, jobType: j.jobType,
    status: j.status, priority: j.priority, vacancies: String(j.vacancies),
    salaryMin: String(j.salaryMin), salaryMax: String(j.salaryMax), currency: j.currency,
    assignedTo: j.assignedTo, deadline: j.deadline,
    description: j.description, requirements: j.requirements, tags: j.tags.join(", "),
  };
}

const cls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none border transition-all focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const areaCls = "w-full rounded-lg px-3 py-2 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none";
const sty = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };
function Lbl({ t }: { t: string }) {
  return <label className="block text-[10.5px] font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{t}</label>;
}

const RECRUITERS = ["Arjun Kumar", "Priya Menon", "Rahul Sharma", "Sneha Iyer"];
const CURRENCIES = ["AED", "INR", "SAR", "OMR", "MVR", "KWD", "BHD", "USD"];

interface Props { open: boolean; onClose: () => void; onSave: (d: FormData) => void; job?: Job | null; mode: "add" | "edit"; }

export default function JobModal({ open, onClose, onSave, job, mode }: Props) {
  const [form, setForm] = useState<FormData>(empty);
  const [step, setStep] = useState(1);

  useEffect(() => { if (open) { setStep(1); setForm(job ? toForm(job) : empty); } }, [open, job]);
  if (!open) return null;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const selectedClient = mockClients.find(c => c.id === form.clientId);

  const STEPS = [{ id: 1, label: "Job Details" }, { id: 2, label: "Requirements" }, { id: 3, label: "Assignment" }];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", maxHeight: "93vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <div>
            <h2 className="text-[15px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>
              {mode === "add" ? "Post New Job Order" : `Edit ${job?.jobCode}`}
            </h2>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg" style={{ color: "var(--bz-text-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 px-5 sm:px-6 py-3 border-b shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <button onClick={() => setStep(s.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
                style={{ backgroundColor: step === s.id ? "rgba(99,102,241,0.12)" : "transparent", color: step === s.id ? "#6366F1" : step > s.id ? "#10B981" : "var(--bz-text-3)" }}>
                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-extrabold border"
                  style={{ borderColor: step >= s.id ? (step > s.id ? "#10B981" : "#6366F1") : "var(--bz-border-hard)", backgroundColor: step > s.id ? "#10B981" : step === s.id ? "#6366F1" : "transparent", color: step >= s.id ? "#fff" : "var(--bz-text-3)" }}>
                  {step > s.id ? "✓" : s.id}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <div className="w-6 h-px" style={{ backgroundColor: "var(--bz-border-hard)" }} />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {/* Step 1 — Job Details */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Lbl t="Job Title *" /><input className={cls} style={sty} value={form.title} onChange={set("title")} placeholder="e.g. Senior Civil Engineer" /></div>
              <div className="sm:col-span-2">
                <Lbl t="Client *" />
                <select className={cls} style={sty} value={form.clientId} onChange={set("clientId")}>
                  <option value="">Select client…</option>
                  {mockClients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
                {selectedClient && <p className="mt-1 text-[11px]" style={{ color: "var(--bz-text-3)" }}>{selectedClient.city}, {selectedClient.country}</p>}
              </div>
              <div><Lbl t="Department" /><input className={cls} style={sty} value={form.department} onChange={set("department")} placeholder="Engineering" /></div>
              <div><Lbl t="Location" /><input className={cls} style={sty} value={form.location} onChange={set("location")} placeholder="Dubai" /></div>
              <div><Lbl t="Country" /><input className={cls} style={sty} value={form.country} onChange={set("country")} placeholder="UAE" /></div>
              <div>
                <Lbl t="Job Type" />
                <select className={cls} style={sty} value={form.jobType} onChange={set("jobType")}>
                  {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map(t => <option key={t} value={t}>{JOB_TYPE_LABELS[t]}</option>)}
                </select>
              </div>
              <div>
                <Lbl t="Priority" />
                <select className={cls} style={sty} value={form.priority} onChange={set("priority")}>
                  {(["urgent","high","medium","low"] as JobPriority[]).map(p => <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>)}
                </select>
              </div>
              <div>
                <Lbl t="Status" />
                <select className={cls} style={sty} value={form.status} onChange={set("status")}>
                  {(Object.keys(STATUS_CONFIG) as JobStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                </select>
              </div>
              <div><Lbl t="No. of Vacancies" /><input className={cls} style={sty} type="number" value={form.vacancies} onChange={set("vacancies")} /></div>
              <div><Lbl t="Deadline" /><input className={cls} style={sty} type="date" value={form.deadline} onChange={set("deadline")} /></div>
              <div>
                <Lbl t="Currency" />
                <select className={cls} style={sty} value={form.currency} onChange={set("currency")}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><Lbl t="Salary Min" /><input className={cls} style={sty} type="number" value={form.salaryMin} onChange={set("salaryMin")} placeholder="15000" /></div>
              <div><Lbl t="Salary Max" /><input className={cls} style={sty} type="number" value={form.salaryMax} onChange={set("salaryMax")} placeholder="25000" /></div>
            </div>
          )}

          {/* Step 2 — Description & Requirements */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Lbl t="Job Description *" />
                <textarea className={areaCls} style={sty} rows={5} value={form.description} onChange={set("description")} placeholder="Describe the role, responsibilities, and what the candidate will be doing…" />
              </div>
              <div>
                <Lbl t="Requirements (one per line)" />
                <textarea className={areaCls} style={sty} rows={5} value={form.requirements} onChange={set("requirements")} placeholder="5+ years experience&#10;Relevant degree&#10;Specific certification" />
              </div>
              <div>
                <Lbl t="Tags (comma separated)" />
                <input className={cls} style={sty} value={form.tags} onChange={set("tags")} placeholder="Engineering, Senior, UAE, Construction" />
              </div>
            </div>
          )}

          {/* Step 3 — Assignment */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Lbl t="Assigned Recruiter *" />
                <select className={cls} style={sty} value={form.assignedTo} onChange={set("assignedTo")}>
                  <option value="">Select recruiter…</option>
                  {RECRUITERS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {/* Summary card */}
              <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: "rgba(99,102,241,0.03)", borderColor: "rgba(99,102,241,0.2)" }}>
                <p className="text-[11.5px] font-bold" style={{ color: "#6366F1" }}>Job Order Summary</p>
                {[
                  { l: "Title",     v: form.title || "—" },
                  { l: "Client",    v: selectedClient?.companyName || "—" },
                  { l: "Location",  v: form.location && form.country ? `${form.location}, ${form.country}` : "—" },
                  { l: "Type",      v: JOB_TYPE_LABELS[form.jobType] },
                  { l: "Priority",  v: PRIORITY_CONFIG[form.priority].label },
                  { l: "Vacancies", v: form.vacancies },
                  { l: "Salary",    v: form.salaryMin && form.salaryMax ? `${form.currency} ${Number(form.salaryMin).toLocaleString()} – ${Number(form.salaryMax).toLocaleString()}` : "—" },
                  { l: "Deadline",  v: form.deadline || "—" },
                ].map(r => (
                  <div key={r.l} className="flex justify-between text-[12px]">
                    <span style={{ color: "var(--bz-text-3)" }}>{r.l}</span>
                    <span className="font-semibold" style={{ color: "var(--bz-text-1)" }}>{r.v}</span>
                  </div>
                ))}
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
            {[1, 2, 3].map(s => <div key={s} className="h-1.5 rounded-full transition-all duration-300" style={{ width: step === s ? "20px" : "6px", backgroundColor: step >= s ? "#6366F1" : "var(--bz-border-hard)" }} />)}
          </div>
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
              Next <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ) : (
            <button onClick={() => { onSave(form); onClose(); }} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              {mode === "add" ? "Post Job" : "Update Job"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
