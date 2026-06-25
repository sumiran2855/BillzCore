"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Candidate, DocumentStatus, mockCandidates } from "@/types/types";
import CandidateModal from "./candidatesModal";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:     { label: "Active",     color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  processing: { label: "Processing", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  offered:    { label: "Offered",    color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  new:        { label: "New",        color: "#06B6D4", bg: "rgba(6,182,212,0.10)" },
  expired:    { label: "Expired",    color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
  rejected:   { label: "Rejected",   color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  placed:     { label: "Placed",     color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" },
};

const DOC_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string; icon: string }> = {
  valid:    { label: "Valid",    color: "#10B981", bg: "rgba(16,185,129,0.10)", icon: "✓" },
  expiring: { label: "Expiring", color: "#F59E0B", bg: "rgba(245,158,11,0.10)", icon: "⚠" },
  expired:  { label: "Expired",  color: "#EF4444", bg: "rgba(239,68,68,0.10)", icon: "✗" },
  missing:  { label: "Missing",  color: "#94A3B8", bg: "rgba(148,163,184,0.10)", icon: "—" },
};

function avatarColor(id: string) {
  const colors = ["#6366F1", "#8B5CF6", "#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#EC4899"];
  return colors[parseInt(id) % colors.length];
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
        <h3 className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string | undefined; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
      <span className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{label}</span>
      <span className="text-[12.5px] font-semibold" style={{ color: highlight ? "#6366F1" : "var(--bz-text-1)" }}>{value || "—"}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-[12px] font-semibold ml-1" style={{ color: "var(--bz-text-2)" }}>{rating > 0 ? rating.toFixed(1) : "Unrated"}</span>
    </div>
  );
}

const TIMELINE = [
  { date: "2024-06-20", event: "Insurance renewal reminder sent", type: "warning" },
  { date: "2024-05-01", event: "Work permit renewal initiated", type: "info" },
  { date: "2024-03-15", event: "Performance review completed — Excellent", type: "success" },
  { date: "2024-02-01", event: "Placed at client site — Acme Corp", type: "success" },
  { date: "2024-01-15", event: "Documents verified & approved", type: "success" },
  { date: "2024-01-10", event: "Application received", type: "info" },
];

const TIMELINE_COLORS: Record<string, string> = { success: "#10B981", warning: "#F59E0B", info: "#6366F1" };

export default function CandidateDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [candidates, setCandidates] = useState(mockCandidates);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "salary" | "timeline" | "notes">("overview");

  const candidate = candidates.find(c => c.id === id) || candidates[0];

  if (!candidate) return (
    <div className="text-center py-20">
      <p className="text-[14px]" style={{ color: "var(--bz-text-2)" }}>Candidate not found.</p>
      <Link href="/dashboard/candidates" className="text-[#6366F1] text-[12px] underline mt-2 block">← Back to candidates</Link>
    </div>
  );

  const color = avatarColor(candidate.id);
  const cfg = STATUS_CONFIG[candidate.status] || STATUS_CONFIG.new;
  const docList = Object.entries(candidate.documents) as [string, typeof candidate.documents.passport][];
  const validDocs = docList.filter(([, d]) => d.status === "valid").length;
  const missingDocs = docList.filter(([, d]) => d.status === "missing").length;
  const expiringDocs = docList.filter(([, d]) => d.status === "expiring" || d.status === "expired").length;

  const netSalary = candidate.basicSalary
    + candidate.allowances.reduce((s, a) => s + a.amount, 0)
    - candidate.deductions.reduce((s, d) => s + d.amount, 0);

  function handleSave(formData: any) {
    setCandidates(prev => prev.map(c => c.id === candidate.id ? {
      ...c,
      firstName: formData.firstName, lastName: formData.lastName,
      nationality: formData.nationality, role: formData.role,
      department: formData.department, status: formData.status,
      basicSalary: Number(formData.basicSalary), email: formData.email,
      phone: formData.phone, notes: formData.notes, client: formData.client,
      recruiter: formData.recruiter,
    } : c));
  }

  const TABS = ["overview", "documents", "salary", "timeline", "notes"] as const;

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--bz-text-3)" }}>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/candidates" className="hover:underline">Candidates</Link>
        <span>/</span>
        <span style={{ color: "var(--bz-text-1)" }}>{candidate.firstName} {candidate.lastName}</span>
      </div>

      {/* Hero Card */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        {/* Color bar */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}77)` }} />
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl text-white text-[18px] sm:text-[20px] font-extrabold shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
                  {(candidate.firstName[0] + candidate.lastName[0]).toUpperCase()}
                </span>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                  style={{ borderColor: "var(--bz-card-bg)", backgroundColor: cfg.color, color: "#fff" }}>✓</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>
                    {candidate.firstName} {candidate.lastName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] font-semibold" style={{ color: "var(--bz-text-2)" }}>{candidate.role} · {candidate.department}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                  <span className="text-[11px] sm:text-[12px]" style={{ color: "var(--bz-text-3)" }}>{candidate.code}</span>
                  <span className="text-[11px] sm:text-[12px]" style={{ color: "var(--bz-text-3)" }}>🌍 {candidate.nationality}</span>
                  {candidate.client && <span className="text-[11px] sm:text-[12px]" style={{ color: "var(--bz-text-3)" }}>🏢 {candidate.client}</span>}
                  <span className="text-[11px] sm:text-[12px]" style={{ color: "var(--bz-text-3)" }}>📅 Applied {candidate.appliedDate}</span>
                </div>
                <div className="mt-2">
                  <StarRating rating={candidate.rating} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end">
              {/* Doc health */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="rounded-lg border px-3 py-2 text-center min-w-[64px]" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
                  <p className="text-[15px] sm:text-[16px] font-extrabold" style={{ color: "#10B981" }}>{validDocs}</p>
                  <p className="text-[9.5px] font-semibold" style={{ color: "var(--bz-text-3)" }}>Valid Docs</p>
                </div>
                {expiringDocs > 0 && (
                  <div className="rounded-lg border px-3 py-2 text-center min-w-[64px]" style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)" }}>
                    <p className="text-[15px] sm:text-[16px] font-extrabold" style={{ color: "#EF4444" }}>{expiringDocs}</p>
                    <p className="text-[9.5px] font-semibold" style={{ color: "#EF4444" }}>Need Renewal</p>
                  </div>
                )}
                <div className="rounded-lg border px-3 py-2 text-center min-w-[64px]" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
                  <p className="text-[13px] sm:text-[16px] font-extrabold" style={{ color: "#6366F1" }}>{candidate.currency} {candidate.basicSalary.toLocaleString()}</p>
                  <p className="text-[9.5px] font-semibold" style={{ color: "var(--bz-text-3)" }}>Basic Salary</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[12.5px] font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--bz-gradient)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Edit
                </button>
                <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[12.5px] font-semibold border transition-all"
                  style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Quick contact */}
          <div className="mt-4 pt-4 border-t flex items-center gap-3 sm:gap-4 flex-wrap" style={{ borderColor: "var(--bz-border-hard)" }}>
            {[
              { icon: "📧", label: candidate.email },
              { icon: "📱", label: candidate.phone },
              { icon: "💬", label: candidate.whatsapp || candidate.phone },
              { icon: "📍", label: `${candidate.city}, ${candidate.country}` },
            ].map(item => (
              <div key={item.icon} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] min-w-0" style={{ color: "var(--bz-text-3)" }}>
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-t overflow-x-auto px-2 sm:px-5" style={{ borderColor: "var(--bz-border-hard)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 sm:px-4 py-3 text-[12px] sm:text-[12.5px] font-semibold capitalize border-b-2 transition-all shrink-0"
              style={{
                borderBottomColor: activeTab === tab ? "#6366F1" : "transparent",
                color: activeTab === tab ? "#6366F1" : "var(--bz-text-3)",
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <Section title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="First Name" value={candidate.firstName} />
                  <InfoRow label="Last Name" value={candidate.lastName} />
                  <InfoRow label="Date of Birth" value={candidate.dateOfBirth} />
                  <InfoRow label="Gender" value={candidate.gender} />
                  <InfoRow label="Marital Status" value={candidate.maritalStatus} />
                  <InfoRow label="Nationality" value={candidate.nationality} />
                </div>
                <div>
                  <InfoRow label="Email" value={candidate.email} />
                  <InfoRow label="Phone" value={candidate.phone} />
                  <InfoRow label="WhatsApp" value={candidate.whatsapp} />
                  <InfoRow label="City" value={candidate.city} />
                  <InfoRow label="Country" value={candidate.country} />
                  <InfoRow label="Address" value={candidate.address} />
                </div>
              </div>
            </Section>

            <Section title="Professional Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="Role" value={candidate.role} />
                  <InfoRow label="Department" value={candidate.department} />
                  <InfoRow label="Experience" value={candidate.experience} />
                  <InfoRow label="Education" value={candidate.education} />
                </div>
                <div>
                  <InfoRow label="Recruiter" value={candidate.recruiter} />
                  <InfoRow label="Source" value={candidate.source} />
                  <InfoRow label="Client" value={candidate.client} />
                  <InfoRow label="Applied Date" value={candidate.appliedDate} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                <p className="text-[11.5px] font-semibold mb-2" style={{ color: "var(--bz-text-3)" }}>Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "rgba(99,102,241,0.10)", color: "#6366F1" }}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                <p className="text-[11.5px] font-semibold mb-2" style={{ color: "var(--bz-text-3)" }}>Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.languages.map(l => (
                    <span key={l} className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "rgba(16,185,129,0.10)", color: "#10B981" }}>{l}</span>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-5">
            {/* Doc health summary */}
            <Section title="Document Health">
              <div className="space-y-2">
                {docList.map(([key, doc]) => {
                  const dcfg = DOC_CONFIG[doc.status];
                  return (
                    <div key={key} className="flex items-center justify-between py-1.5">
                      <span className="text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>{doc.name}</span>
                      <div className="flex items-center gap-2">
                        {doc.expiryDate && <span className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>{doc.expiryDate}</span>}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: dcfg.bg, color: dcfg.color }}>
                          {dcfg.icon} {dcfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Bank summary */}
            {candidate.bankName && (
              <Section title="Bank Details">
                <InfoRow label="Bank" value={candidate.bankName} />
                <InfoRow label="Branch" value={candidate.bankBranch} />
                <InfoRow label="Account" value={candidate.bankAccount ? "****" + candidate.bankAccount.slice(-4) : undefined} />
                <InfoRow label="IFSC" value={candidate.bankIFSC} />
              </Section>
            )}
          </div>
        </div>
      )}

      {/* TAB: Documents */}
      {activeTab === "documents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docList.map(([key, doc]) => {
            const dcfg = DOC_CONFIG[doc.status];
            return (
              <div key={key} className="rounded-xl border p-4 transition-all hover:shadow-md" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: doc.status === "expired" || doc.status === "expiring" ? dcfg.color + "55" : "var(--bz-border-hard)" }}>
                {(doc.status === "expired" || doc.status === "expiring") && (
                  <div className="h-0.5 -mx-4 -mt-4 mb-4 rounded-t-xl" style={{ backgroundColor: dcfg.color }} />
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-10 w-10 flex items-center justify-center rounded-lg text-xl" style={{ backgroundColor: dcfg.bg }}>
                      {key === "passport" ? "🛂" : key === "visa" ? "✈️" : key === "workPermit" ? "📋" : key === "medical" ? "🏥" : key === "insurance" ? "🛡️" : key === "idCard" ? "🪪" : key === "contract" ? "📝" : "📷"}
                    </span>
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{doc.name}</p>
                      {doc.uploadedDate && <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Uploaded {doc.uploadedDate}</p>}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold" style={{ backgroundColor: dcfg.bg, color: dcfg.color }}>
                    {dcfg.icon} {dcfg.label}
                  </span>
                </div>
                {doc.expiryDate && (
                  <div className="flex items-center justify-between text-[12px] mb-3">
                    <span style={{ color: "var(--bz-text-3)" }}>Expiry Date</span>
                    <span className="font-semibold" style={{ color: doc.status === "expired" ? "#EF4444" : doc.status === "expiring" ? "#F59E0B" : "var(--bz-text-1)" }}>{doc.expiryDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {doc.status === "missing" ? (
                    <button className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg text-[12px] font-semibold border-dashed border-2 transition-colors hover:bg-[rgba(99,102,241,0.05)]" style={{ borderColor: "#6366F1", color: "#6366F1" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Upload Document
                    </button>
                  ) : (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-semibold transition-colors" style={{ backgroundColor: "rgba(99,102,241,0.08)", color: "#6366F1" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-semibold border transition-colors" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                        Replace
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: Salary */}
      {activeTab === "salary" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Section title="Salary Breakdown">
            <div className="space-y-0">
              <div className="flex justify-between py-2.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
                <span className="text-[13px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Basic Salary</span>
                <span className="text-[14px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{candidate.currency} {candidate.basicSalary.toLocaleString()}</span>
              </div>
              {candidate.allowances.length > 0 && (
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider pt-2 pb-1" style={{ color: "#10B981" }}>Allowances</p>
                  {candidate.allowances.map(a => (
                    <div key={a.name} className="flex justify-between py-2 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
                      <span className="text-[12.5px]" style={{ color: "var(--bz-text-3)" }}>+ {a.name}</span>
                      <span className="text-[12.5px] font-semibold" style={{ color: "#10B981" }}>{candidate.currency} {a.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              {candidate.deductions.length > 0 && (
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-wider pt-2 pb-1" style={{ color: "#EF4444" }}>Deductions</p>
                  {candidate.deductions.map(d => (
                    <div key={d.name} className="flex justify-between py-2 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
                      <span className="text-[12.5px]" style={{ color: "var(--bz-text-3)" }}>− {d.name}</span>
                      <span className="text-[12.5px] font-semibold" style={{ color: "#EF4444" }}>{candidate.currency} {d.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-3 mt-1">
                <span className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>Net Salary</span>
                <span className="text-[18px] font-extrabold" style={{ color: "#6366F1" }}>{candidate.currency} {netSalary.toLocaleString()}</span>
              </div>
            </div>
          </Section>

          <Section title="Bank Details" action={<button className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>Edit</button>}>
            {candidate.bankName ? (
              <>
                <InfoRow label="Bank Name" value={candidate.bankName} />
                <InfoRow label="Branch" value={candidate.bankBranch} />
                <InfoRow label="Account Number" value={candidate.bankAccount ? "****" + candidate.bankAccount.slice(-4) : undefined} />
                <InfoRow label="IFSC Code" value={candidate.bankIFSC} />
              </>
            ) : (
              <div className="text-center py-6">
                <span className="text-3xl">🏦</span>
                <p className="text-[13px] mt-2 font-semibold" style={{ color: "var(--bz-text-2)" }}>No bank details added</p>
                <button onClick={() => setEditOpen(true)} className="mt-3 text-[12px] font-semibold" style={{ color: "#6366F1" }}>+ Add bank details</button>
              </div>
            )}
          </Section>
        </div>
      )}

      {/* TAB: Timeline */}
      {activeTab === "timeline" && (
        <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <h3 className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Activity Timeline</h3>
          </div>
          <div className="p-5">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: "var(--bz-border-hard)" }} />
              <div className="space-y-5 pl-10">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[26px] h-4 w-4 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: TIMELINE_COLORS[t.type] }}>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TIMELINE_COLORS[t.type] }} />
                    </div>
                    <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{t.event}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{t.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Notes */}
      {activeTab === "notes" && (
        <Section title="Internal Notes" action={<button className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>Save</button>}>
          <textarea
            className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none"
            style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)", minHeight: "200px" }}
            defaultValue={candidate.notes}
            placeholder="Add internal notes about this candidate..."
          />
        </Section>
      )}

      <CandidateModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        candidate={candidate}
        mode="edit"
      />
    </div>
  );
}