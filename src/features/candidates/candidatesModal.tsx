"use client";

import { useState, useEffect } from "react";
import { Candidate, NATIONALITIES, ROLES, DEPARTMENTS, SOURCES, CandidateStatus } from "@/types/types";

const STEPS = [
  { id: 1, label: "Basic Info", icon: "👤" },
  { id: 2, label: "Job Details", icon: "💼" },
  { id: 3, label: "Salary", icon: "💰" },
  { id: 4, label: "Bank Details", icon: "🏦" },
  { id: 5, label: "Documents", icon: "📄" },
  { id: 6, label: "Review", icon: "✅" },
];

type FormData = {
  firstName: string; lastName: string; nationality: string; gender: string;
  dateOfBirth: string; maritalStatus: string; email: string; phone: string;
  whatsapp: string; address: string; city: string; country: string;
  role: string; department: string; experience: string; education: string;
  skills: string; languages: string; source: string; recruiter: string;
  status: CandidateStatus; client: string; notes: string;
  basicSalary: string; currency: string;
  housingAllowance: string; transportAllowance: string; foodAllowance: string;
  taxDeduction: string; pfDeduction: string;
  bankName: string; bankAccount: string; bankIFSC: string; bankBranch: string;
  passportNumber: string; passportExpiry: string;
  visaExpiry: string; workPermitExpiry: string; medicalExpiry: string; insuranceExpiry: string;
};

const emptyForm: FormData = {
  firstName: "", lastName: "", nationality: "Indian", gender: "Male",
  dateOfBirth: "", maritalStatus: "Single", email: "", phone: "", whatsapp: "",
  address: "", city: "", country: "", role: "", department: "", experience: "",
  education: "", skills: "", languages: "", source: "Direct Application",
  recruiter: "", status: "new", client: "", notes: "",
  basicSalary: "", currency: "MVR",
  housingAllowance: "", transportAllowance: "", foodAllowance: "",
  taxDeduction: "", pfDeduction: "",
  bankName: "", bankAccount: "", bankIFSC: "", bankBranch: "",
  passportNumber: "", passportExpiry: "", visaExpiry: "", workPermitExpiry: "",
  medicalExpiry: "", insuranceExpiry: "",
};

function candidateToForm(c: Candidate): FormData {
  return {
    firstName: c.firstName, lastName: c.lastName, nationality: c.nationality,
    gender: c.gender, dateOfBirth: c.dateOfBirth, maritalStatus: c.maritalStatus,
    email: c.email, phone: c.phone, whatsapp: c.whatsapp || "",
    address: c.address, city: c.city, country: c.country,
    role: c.role, department: c.department, experience: c.experience,
    education: c.education, skills: c.skills.join(", "), languages: c.languages.join(", "),
    source: c.source, recruiter: c.recruiter, status: c.status, client: c.client || "", notes: c.notes || "",
    basicSalary: String(c.basicSalary), currency: c.currency,
    housingAllowance: String(c.allowances.find(a => a.name === "Housing")?.amount || ""),
    transportAllowance: String(c.allowances.find(a => a.name === "Transport")?.amount || ""),
    foodAllowance: String(c.allowances.find(a => a.name === "Food")?.amount || ""),
    taxDeduction: String(c.deductions.find(d => d.name === "Tax")?.amount || ""),
    pfDeduction: String(c.deductions.find(d => d.name === "PF")?.amount || ""),
    bankName: c.bankName || "", bankAccount: c.bankAccount || "",
    bankIFSC: c.bankIFSC || "", bankBranch: c.bankBranch || "",
    passportNumber: "", passportExpiry: c.documents.passport.expiryDate || "",
    visaExpiry: c.documents.visa.expiryDate || "",
    workPermitExpiry: c.documents.workPermit.expiryDate || "",
    medicalExpiry: c.documents.medical.expiryDate || "",
    insuranceExpiry: c.documents.insurance.expiryDate || "",
  };
}

interface CandidateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  candidate?: Candidate | null;
  mode: "add" | "edit";
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold mb-1" style={{ color: "var(--bz-text-2)" }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none transition-all border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const inputStyle = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };

function Input({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} required={required}>
      <input className={inputCls} style={inputStyle} {...props} />
    </Field>
  );
}

function Select({ label, required, children, ...props }: { label: string; required?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} required={required}>
      <select className={inputCls} style={inputStyle} {...props}>{children}</select>
    </Field>
  );
}

export default function CandidateModal({ open, onClose, onSave, candidate, mode }: CandidateModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm(candidate ? candidateToForm(candidate) : emptyForm);
    }
  }, [open, candidate]);

  if (!open) return null;

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const netSalary = () => {
    const base = Number(form.basicSalary) || 0;
    const allow = (Number(form.housingAllowance) || 0) + (Number(form.transportAllowance) || 0) + (Number(form.foodAllowance) || 0);
    const ded = (Number(form.taxDeduction) || 0) + (Number(form.pfDeduction) || 0);
    return base + allow - ded;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "var(--bz-border-hard)" }}>
          <div>
            <h2 className="text-[16px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>
              {mode === "add" ? "Add New Candidate" : `Edit — ${candidate?.firstName} ${candidate?.lastName}`}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Step {step} of {STEPS.length}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors" style={{ color: "var(--bz-text-3)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-0 px-6 py-3 border-b shrink-0 overflow-x-auto" style={{ borderColor: "var(--bz-border-hard)" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-0 shrink-0">
              <button
                onClick={() => setStep(s.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
                style={{
                  backgroundColor: step === s.id ? "rgba(99,102,241,0.12)" : "transparent",
                  color: step === s.id ? "#6366F1" : step > s.id ? "#10B981" : "var(--bz-text-3)",
                }}
              >
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
              <Input label="First Name" required value={form.firstName} onChange={set("firstName")} placeholder="Arjun" />
              <Input label="Last Name" required value={form.lastName} onChange={set("lastName")} placeholder="Kumar" />
              <Select label="Nationality" required value={form.nationality} onChange={set("nationality")}>
                {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
              </Select>
              <Select label="Gender" value={form.gender} onChange={set("gender")}>
                {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
              </Select>
              <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
              <Select label="Marital Status" value={form.maritalStatus} onChange={set("maritalStatus")}>
                {["Single", "Married", "Divorced", "Widowed"].map(m => <option key={m}>{m}</option>)}
              </Select>
              <Input label="Email" type="email" required value={form.email} onChange={set("email")} placeholder="email@example.com" />
              <Input label="Phone" required value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
              <Input label="WhatsApp" value={form.whatsapp} onChange={set("whatsapp")} placeholder="+91 98765 43210" />
              <Input label="City" value={form.city} onChange={set("city")} placeholder="Mumbai" />
              <Input label="Country" value={form.country} onChange={set("country")} placeholder="India" />
              <Field label="Address">
                <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none" style={inputStyle} rows={2} value={form.address} onChange={set("address")} placeholder="Full address" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Role / Position" required value={form.role} onChange={set("role")}>
                <option value="">Select role...</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </Select>
              <Select label="Department" value={form.department} onChange={set("department")}>
                <option value="">Select department...</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </Select>
              <Input label="Experience" value={form.experience} onChange={set("experience")} placeholder="5 years" />
              <Input label="Education" value={form.education} onChange={set("education")} placeholder="B.Tech Civil" />
              <Field label="Skills (comma separated)">
                <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none" style={inputStyle} rows={2} value={form.skills} onChange={set("skills")} placeholder="AutoCAD, Project Management, Team Leadership" />
              </Field>
              <Field label="Languages (comma separated)">
                <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none" style={inputStyle} rows={2} value={form.languages} onChange={set("languages")} placeholder="Hindi, English, Arabic" />
              </Field>
              <Select label="Status" value={form.status} onChange={set("status")}>
                {["new", "processing", "offered", "active", "placed", "rejected", "expired"].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
              <Select label="Source" value={form.source} onChange={set("source")}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </Select>
              <Input label="Recruiter" value={form.recruiter} onChange={set("recruiter")} placeholder="Recruiter name" />
              <Input label="Client / Employer" value={form.client} onChange={set("client")} placeholder="Acme Corp" />
              <Field label="Notes" >
                <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none col-span-2" style={inputStyle} rows={3} value={form.notes} onChange={set("notes")} placeholder="Internal notes about this candidate..." />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Basic Salary" required type="number" value={form.basicSalary} onChange={set("basicSalary")} placeholder="1500" />
                <Select label="Currency" value={form.currency} onChange={set("currency")}>
                  {["MVR", "USD", "INR", "AED", "SAR"].map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <p className="text-[12px] font-bold mb-2" style={{ color: "var(--bz-text-2)" }}>Allowances</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input label="Housing" type="number" value={form.housingAllowance} onChange={set("housingAllowance")} placeholder="0" />
                  <Input label="Transport" type="number" value={form.transportAllowance} onChange={set("transportAllowance")} placeholder="0" />
                  <Input label="Food" type="number" value={form.foodAllowance} onChange={set("foodAllowance")} placeholder="0" />
                </div>
              </div>
              <div>
                <p className="text-[12px] font-bold mb-2" style={{ color: "var(--bz-text-2)" }}>Deductions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Tax" type="number" value={form.taxDeduction} onChange={set("taxDeduction")} placeholder="0" />
                  <Input label="Provident Fund" type="number" value={form.pfDeduction} onChange={set("pfDeduction")} placeholder="0" />
                </div>
              </div>
              {form.basicSalary && (
                <div className="rounded-xl p-4 border" style={{ backgroundColor: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.2)" }}>
                  <p className="text-[12px] font-semibold mb-3" style={{ color: "#6366F1" }}>Salary Summary</p>
                  <div className="space-y-1.5">
                    {[
                      { label: "Basic Salary", val: Number(form.basicSalary) || 0, color: "var(--bz-text-1)" },
                      { label: "+ Housing", val: Number(form.housingAllowance) || 0, color: "#10B981" },
                      { label: "+ Transport", val: Number(form.transportAllowance) || 0, color: "#10B981" },
                      { label: "+ Food", val: Number(form.foodAllowance) || 0, color: "#10B981" },
                      { label: "− Tax", val: -(Number(form.taxDeduction) || 0), color: "#EF4444" },
                      { label: "− PF", val: -(Number(form.pfDeduction) || 0), color: "#EF4444" },
                    ].filter(r => r.val !== 0).map(r => (
                      <div key={r.label} className="flex justify-between text-[12.5px]">
                        <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                        <span style={{ color: r.color }}>{form.currency} {Math.abs(r.val).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1.5 mt-1.5 flex justify-between" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
                      <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Net Salary</span>
                      <span className="text-[14px] font-extrabold" style={{ color: "#6366F1" }}>{form.currency} {netSalary().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Bank Name" value={form.bankName} onChange={set("bankName")} placeholder="HDFC Bank" />
              <Input label="Branch" value={form.bankBranch} onChange={set("bankBranch")} placeholder="Andheri West" />
              <Input label="Account Number" value={form.bankAccount} onChange={set("bankAccount")} placeholder="123456789012" />
              <Input label="IFSC / SWIFT Code" value={form.bankIFSC} onChange={set("bankIFSC")} placeholder="HDFC0001234" />
              <div className="col-span-2 rounded-xl p-4 border" style={{ backgroundColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
                <p className="text-[11.5px] flex items-center gap-1.5 font-semibold" style={{ color: "#F59E0B" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  Bank details are stored securely and used for salary disbursement only.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Passport Number" value={form.passportNumber} onChange={set("passportNumber")} placeholder="A1234567" />
                <Input label="Passport Expiry" type="date" value={form.passportExpiry} onChange={set("passportExpiry")} />
                <Input label="Visa Expiry" type="date" value={form.visaExpiry} onChange={set("visaExpiry")} />
                <Input label="Work Permit Expiry" type="date" value={form.workPermitExpiry} onChange={set("workPermitExpiry")} />
                <Input label="Medical Expiry" type="date" value={form.medicalExpiry} onChange={set("medicalExpiry")} />
                <Input label="Insurance Expiry" type="date" value={form.insuranceExpiry} onChange={set("insuranceExpiry")} />
              </div>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: "rgba(99,102,241,0.04)", borderColor: "var(--bz-border-hard)" }}>
                <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--bz-text-2)" }}>Document Upload</p>
                <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>Physical document uploads will be available on the candidate profile page after saving.</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Review all details before saving</p>
              {[
                { title: "Personal Information", items: [
                  ["Name", `${form.firstName} ${form.lastName}`],
                  ["Nationality", form.nationality], ["Gender", form.gender],
                  ["Email", form.email], ["Phone", form.phone],
                ]},
                { title: "Job Details", items: [
                  ["Role", form.role], ["Department", form.department],
                  ["Experience", form.experience], ["Status", form.status],
                  ["Client", form.client || "—"], ["Recruiter", form.recruiter],
                ]},
                { title: "Salary", items: [
                  ["Basic Salary", `${form.currency} ${Number(form.basicSalary || 0).toLocaleString()}`],
                  ["Net Salary", `${form.currency} ${netSalary().toLocaleString()}`],
                ]},
                { title: "Bank Details", items: [
                  ["Bank", form.bankName || "—"], ["Account", form.bankAccount ? "****" + form.bankAccount.slice(-4) : "—"],
                ]},
              ].map(section => (
                <div key={section.title} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
                  <p className="text-[12px] font-bold mb-2" style={{ color: "#6366F1" }}>{section.title}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {section.items.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between col-span-1">
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
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border transition-all"
            style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <div className="flex items-center gap-1">
            {STEPS.map(s => (
              <div key={s.id} className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: step === s.id ? "20px" : "6px", backgroundColor: step >= s.id ? "#6366F1" : "var(--bz-border-hard)" }} />
            ))}
          </div>
          {step < STEPS.length ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--bz-gradient)" }}
            >
              Next
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          ) : (
            <button
              onClick={() => { onSave(form); onClose(); }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {mode === "add" ? "Save Candidate" : "Update Candidate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}