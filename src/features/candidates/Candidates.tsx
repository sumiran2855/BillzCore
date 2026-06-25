"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Candidate, CandidateStatus, mockCandidates, ROLES, DEPARTMENTS, NATIONALITIES } from "@/types/types";
import CandidateModal from "./candidatesModal";

const STATUS_CONFIG: Record<CandidateStatus, { label: string; color: string; bg: string }> = {
  active:     { label: "Active",      color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  processing: { label: "Processing",  color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  offered:    { label: "Offered",     color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  new:        { label: "New",         color: "#06B6D4", bg: "rgba(6,182,212,0.10)" },
  expired:    { label: "Expired",     color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
  rejected:   { label: "Rejected",    color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  placed:     { label: "Placed",      color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" },
};

const DOC_STATUS_COLOR: Record<string, string> = {
  valid:    "#10B981",
  expiring: "#F59E0B",
  expired:  "#EF4444",
  missing:  "#94A3B8",
};

function avatarInitials(c: Candidate) {
  return (c.firstName[0] + c.lastName[0]).toUpperCase();
}

function avatarColor(id: string) {
  const colors = ["#6366F1", "#8B5CF6", "#10B981", "#06B6D4", "#F59E0B", "#EF4444", "#EC4899"];
  return colors[parseInt(id) % colors.length];
}

function StatusPill({ status }: { status: CandidateStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function DocDot({ status }: { status: string }) {
  return <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: DOC_STATUS_COLOR[status] || "#94A3B8" }} />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      {rating > 0 && <span className="text-[10px] ml-1" style={{ color: "var(--bz-text-3)" }}>{rating.toFixed(1)}</span>}
    </div>
  );
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [natFilter, setNatFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "salary" | "date" | "rating">("name");

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || `${c.firstName} ${c.lastName} ${c.code} ${c.role} ${c.nationality}`.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchRole = roleFilter === "all" || c.role === roleFilter;
      const matchDept = deptFilter === "all" || c.department === deptFilter;
      const matchNat = natFilter === "all" || c.nationality === natFilter;
      return matchSearch && matchStatus && matchRole && matchDept && matchNat;
    }).sort((a, b) => {
      if (sortBy === "salary") return b.basicSalary - a.basicSalary;
      if (sortBy === "date") return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      if (sortBy === "rating") return b.rating - a.rating;
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });
  }, [candidates, search, statusFilter, roleFilter, deptFilter, natFilter, sortBy]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: candidates.length };
    candidates.forEach(can => { c[can.status] = (c[can.status] || 0) + 1; });
    return c;
  }, [candidates]);

  const expiringDocs = candidates.reduce((acc, c) => {
    const expiring = Object.values(c.documents).filter(d => d.status === "expiring" || d.status === "expired").length;
    return acc + expiring;
  }, 0);

  function handleSave(formData: any) {
    if (editCandidate) {
      setCandidates(prev => prev.map(c => c.id === editCandidate.id ? {
        ...c,
        firstName: formData.firstName, lastName: formData.lastName,
        nationality: formData.nationality, gender: formData.gender,
        dateOfBirth: formData.dateOfBirth, maritalStatus: formData.maritalStatus,
        email: formData.email, phone: formData.phone, whatsapp: formData.whatsapp,
        address: formData.address, city: formData.city, country: formData.country,
        role: formData.role, department: formData.department, experience: formData.experience,
        education: formData.education, skills: formData.skills.split(",").map((s: string) => s.trim()),
        languages: formData.languages.split(",").map((s: string) => s.trim()),
        source: formData.source, recruiter: formData.recruiter, status: formData.status,
        client: formData.client, notes: formData.notes, basicSalary: Number(formData.basicSalary),
        currency: formData.currency, bankName: formData.bankName, bankAccount: formData.bankAccount,
        bankIFSC: formData.bankIFSC, bankBranch: formData.bankBranch,
        allowances: [
          ...(formData.housingAllowance ? [{ name: "Housing", amount: Number(formData.housingAllowance) }] : []),
          ...(formData.transportAllowance ? [{ name: "Transport", amount: Number(formData.transportAllowance) }] : []),
          ...(formData.foodAllowance ? [{ name: "Food", amount: Number(formData.foodAllowance) }] : []),
        ],
        deductions: [
          ...(formData.taxDeduction ? [{ name: "Tax", amount: Number(formData.taxDeduction) }] : []),
          ...(formData.pfDeduction ? [{ name: "PF", amount: Number(formData.pfDeduction) }] : []),
        ],
      } : c));
    } else {
      const newId = String(Date.now());
      const newCode = `CN-${2000 + candidates.length}`;
      const newCandidate: Candidate = {
        id: newId, code: newCode,
        firstName: formData.firstName, lastName: formData.lastName,
        nationality: formData.nationality, gender: formData.gender as any,
        dateOfBirth: formData.dateOfBirth, maritalStatus: formData.maritalStatus,
        email: formData.email, phone: formData.phone, whatsapp: formData.whatsapp,
        address: formData.address, city: formData.city, country: formData.country,
        role: formData.role, department: formData.department, experience: formData.experience,
        education: formData.education, skills: formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
        languages: formData.languages.split(",").map((s: string) => s.trim()).filter(Boolean),
        source: formData.source, recruiter: formData.recruiter, status: formData.status as CandidateStatus,
        client: formData.client, notes: formData.notes,
        basicSalary: Number(formData.basicSalary), currency: formData.currency,
        bankName: formData.bankName, bankAccount: formData.bankAccount,
        bankIFSC: formData.bankIFSC, bankBranch: formData.bankBranch,
        appliedDate: new Date().toISOString().split("T")[0],
        rating: 0,
        allowances: [
          ...(formData.housingAllowance ? [{ name: "Housing", amount: Number(formData.housingAllowance) }] : []),
          ...(formData.transportAllowance ? [{ name: "Transport", amount: Number(formData.transportAllowance) }] : []),
        ],
        deductions: [
          ...(formData.taxDeduction ? [{ name: "Tax", amount: Number(formData.taxDeduction) }] : []),
        ],
        documents: {
          passport: { name: "Passport", status: "missing" },
          visa: { name: "Visa", status: "missing" },
          workPermit: { name: "Work Permit", status: "missing" },
          medical: { name: "Medical", status: "missing" },
          insurance: { name: "Insurance", status: "missing" },
          idCard: { name: "ID Card", status: "missing" },
          contract: { name: "Contract", status: "missing" },
          photo: { name: "Photo", status: "missing" },
        },
      };
      setCandidates(prev => [newCandidate, ...prev]);
    }
    setEditCandidate(null);
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Candidates</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {candidates.length} total · {counts["active"] || 0} active · {expiringDocs > 0 && <span style={{ color: "#EF4444" }}>{expiringDocs} docs need attention</span>}
          </p>
        </div>
        <button
          onClick={() => { setEditCandidate(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-semibold text-white transition-all hover:opacity-90 shadow-lg shrink-0"
          style={{ background: "var(--bz-gradient)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          <span className="hidden sm:inline">Add Candidate</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text" placeholder="Search candidates…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
            style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Role", value: roleFilter, onChange: setRoleFilter, options: ["all", ...ROLES] },
            { label: "Dept", value: deptFilter, onChange: setDeptFilter, options: ["all", ...DEPARTMENTS] },
            { label: "Nat.", value: natFilter, onChange: setNatFilter, options: ["all", ...NATIONALITIES] },
            { label: "Sort", value: sortBy, onChange: setSortBy as any, options: ["name", "salary", "date", "rating"] },
          ].map(f => (
            <select
              key={f.label}
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              className="h-9 rounded-lg px-2 sm:px-3 text-[11.5px] sm:text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30"
              style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}
            >
              {f.options.map(o => <option key={o} value={o}>{o === "all" ? `All ${f.label}s` : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-0.5 shrink-0" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-card-bg)" }}>
          {(["grid", "list"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className="h-7 w-7 flex items-center justify-center rounded-md transition-all"
              style={{ backgroundColor: viewMode === m ? "rgba(99,102,241,0.12)" : "transparent", color: viewMode === m ? "#6366F1" : "var(--bz-text-3)" }}
            >
              {m === "grid"
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          ))}
        </div>
        <span className="text-[12px] font-semibold" style={{ color: "var(--bz-text-3)" }}>{filtered.length} results</span>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => {
            const color = avatarColor(c.id);
            const cfg = STATUS_CONFIG[c.status];
            const docStatuses = Object.entries(c.documents);
            const netSalary = c.basicSalary + c.allowances.reduce((s, a) => s + a.amount, 0) - c.deductions.reduce((s, d) => s + d.amount, 0);
            return (
              <Link href={`/dashboard/candidates/${c.id}`} key={c.id}>
                <div className="rounded-xl border p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full text-white text-[13px] font-extrabold shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}>
                          {avatarInitials(c)}
                        </span>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2" style={{ borderColor: "var(--bz-card-bg)", backgroundColor: cfg.color }} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold leading-tight" style={{ color: "var(--bz-text-1)" }}>{c.firstName} {c.lastName}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{c.code} · {c.nationality}</p>
                      </div>
                    </div>
                    <StatusPill status={c.status} />
                  </div>

                  {/* Role + Salary */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-2)" }}>{c.role}</span>
                    <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{c.currency} {c.basicSalary.toLocaleString()}</span>
                  </div>

                  {/* Client + Dept */}
                  {(c.client || c.department) && (
                    <div className="flex items-center gap-2 mb-3">
                      {c.client && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(99,102,241,0.08)", color: "#6366F1" }}>
                          🏢 {c.client}
                        </span>
                      )}
                      {c.department && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)", border: "1px solid var(--bz-border-hard)" }}>
                          {c.department}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Documents */}
                  <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                    {docStatuses.map(([key, doc]) => (
                      <div key={key} className="flex items-center gap-1" title={`${doc.name}: ${doc.status}`}>
                        <DocDot status={doc.status} />
                        <span className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>{doc.name.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating */}
                  {c.rating > 0 && (
                    <div className="mt-2">
                      <StarRating rating={c.rating} />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[40px_1fr_120px_100px_120px_100px_80px_80px] gap-4 px-4 py-2.5 border-b text-[11px] font-bold uppercase tracking-wider" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>
            <div />
            <div>Candidate</div>
            <div>Role</div>
            <div>Dept</div>
            <div>Salary</div>
            <div>Status</div>
            <div>Docs</div>
            <div>Actions</div>
          </div>
          {filtered.map(c => {
            const color = avatarColor(c.id);
            const validDocs = Object.values(c.documents).filter(d => d.status === "valid").length;
            const totalDocs = Object.values(c.documents).length;
            return (
              <div key={c.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                {/* Mobile card layout */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-3 hover:bg-[rgba(99,102,241,0.02)] transition-colors">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-bold" style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}>{avatarInitials(c)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{c.firstName} {c.lastName}</p>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{c.role} · {c.department}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[12px] font-bold" style={{ color: "var(--bz-text-1)" }}>{c.currency} {c.basicSalary.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/candidates/${c.id}`}>
                          <button className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                        </Link>
                        <button onClick={() => { setEditCandidate(c); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Desktop row */}
                <div className="hidden sm:grid grid-cols-[40px_1fr_120px_100px_120px_100px_80px_80px] gap-4 px-4 py-3 items-center hover:bg-[rgba(99,102,241,0.02)] transition-colors">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-white text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}>{avatarInitials(c)}</span>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{c.firstName} {c.lastName}</p>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{c.code} · {c.nationality}</p>
                  </div>
                  <p className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{c.role}</p>
                  <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{c.department}</p>
                  <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{c.currency} {c.basicSalary.toLocaleString()}</p>
                  <StatusPill status={c.status} />
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-14 rounded-full" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(validDocs / totalDocs) * 100}%`, backgroundColor: validDocs === totalDocs ? "#10B981" : validDocs >= 5 ? "#F59E0B" : "#EF4444" }} />
                    </div>
                    <span className="text-[10px]" style={{ color: "var(--bz-text-3)" }}>{validDocs}/{totalDocs}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/candidates/${c.id}`}>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                    </Link>
                    <button onClick={() => { setEditCandidate(c); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-[14px] font-semibold" style={{ color: "var(--bz-text-2)" }}>No candidates found</p>
          <p className="text-[12.5px] mt-1" style={{ color: "var(--bz-text-3)" }}>Try adjusting your filters or search query</p>
        </div>
      )}

      <CandidateModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditCandidate(null); }}
        onSave={handleSave}
        candidate={editCandidate}
        mode={editCandidate ? "edit" : "add"}
      />
    </div>
  );
}