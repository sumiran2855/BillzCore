"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Job, JobStatus, JobPriority, JobType,
  STATUS_CONFIG, PRIORITY_CONFIG, JOB_TYPE_LABELS, KANBAN_COLUMNS, mockJobs,
} from "./jobTypes";
import JobModal from "./jobModal";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: JobStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />{c.label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: JobPriority }) {
  const c = PRIORITY_CONFIG[priority];
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: c.color }} />
      {c.label}
    </span>
  );
}

function FillProgress({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const color = pct === 100 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#6366F1";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10.5px] font-bold shrink-0" style={{ color }}>{filled}/{total}</span>
    </div>
  );
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────

function KanbanCard({ job, onEdit }: { job: Job; onEdit: (j: Job) => void }) {
  const pc = PRIORITY_CONFIG[job.priority];
  const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 86400000);
  return (
    <div className="relative rounded-xl border p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition-all duration-200 group"
      style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", borderLeft: `3px solid ${pc.color}` }}>
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold" style={{ color: "#6366F1" }}>{job.jobCode}</p>
          <Link href={`/dashboard/jobs/${job.id}`}>
            <span className="absolute inset-0" />
            <p className="text-[12.5px] font-bold mt-0.5 leading-tight hover:underline line-clamp-2" style={{ color: "var(--bz-text-1)" }}>{job.title}</p>
          </Link>
        </div>
        <button onClick={() => onEdit(job)} className="relative z-10 h-6 w-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--bz-text-3)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>

      {/* Client + Location */}
      <div>
        <p className="text-[11.5px] font-semibold" style={{ color: "var(--bz-text-2)" }}>{job.clientName}</p>
        <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>📍 {job.location}, {job.country}</p>
      </div>

      {/* Priority + Type */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <PriorityDot priority={job.priority} />
        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)", border: "1px solid var(--bz-border-hard)" }}>
          {JOB_TYPE_LABELS[job.jobType]}
        </span>
      </div>

      {/* Fill progress */}
      <div>
        <p className="text-[10px] mb-1" style={{ color: "var(--bz-text-3)" }}>Vacancies Filled</p>
        <FillProgress filled={job.filledVacancies} total={job.vacancies} />
      </div>

      {/* Pipeline mini stats */}
      <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
        {[
          { icon: "👤", val: job.applications, tip: "Applications" },
          { icon: "🎤", val: job.interviews,   tip: "Interviews" },
          { icon: "📄", val: job.offers,        tip: "Offers" },
        ].map(s => (
          <div key={s.tip} className="flex-1 text-center">
            <p className="text-[11px] font-bold" style={{ color: "var(--bz-text-1)" }}>{s.val}</p>
            <p className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>{s.tip}</p>
          </div>
        ))}
        <div className="flex-1 text-center">
          <p className="text-[11px] font-bold" style={{ color: daysLeft < 0 ? "#EF4444" : daysLeft <= 7 ? "#F59E0B" : "var(--bz-text-1)" }}>
            {daysLeft < 0 ? "Due" : `${daysLeft}d`}
          </p>
          <p className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>Deadline</p>
        </div>
      </div>

      {/* Recruiter */}
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-white text-[8px] font-extrabold shrink-0"
          style={{ background: "var(--bz-gradient)" }}>
          {job.assignedTo.split(" ").map(n => n[0]).join("")}
        </span>
        <span className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>{job.assignedTo}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | JobStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | JobPriority>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter(j => {
      const matchStatus   = statusFilter === "all"   || j.status === statusFilter;
      const matchPriority = priorityFilter === "all" || j.priority === priorityFilter;
      const matchSearch   = !q || `${j.title} ${j.clientName} ${j.jobCode} ${j.location}`.toLowerCase().includes(q);
      return matchStatus && matchPriority && matchSearch;
    });
  }, [jobs, statusFilter, priorityFilter, search]);

  const openCount  = jobs.filter(j => j.status === "open").length;
  const filledCount = jobs.filter(j => j.status === "filled").length;
  const urgentCount = jobs.filter(j => j.priority === "urgent").length;
  const totalVacancies = jobs.reduce((s, j) => s + j.vacancies, 0);
  const filledVacancies = jobs.reduce((s, j) => s + j.filledVacancies, 0);

  function handleSave(form: any) {
    const base = {
      jobType: form.jobType as JobType, status: form.status as JobStatus, priority: form.priority as JobPriority,
      title: form.title, clientId: form.clientId,
      clientName: mockJobs.find(j => j.clientId === form.clientId)?.clientName || form.clientId,
      department: form.department, location: form.location, country: form.country,
      vacancies: Number(form.vacancies), salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax),
      currency: form.currency, assignedTo: form.assignedTo, deadline: form.deadline,
      description: form.description, requirements: form.requirements,
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
    };
    if (editJob) {
      setJobs(prev => prev.map(j => j.id === editJob.id ? { ...j, ...base } : j));
    } else {
      setJobs(prev => [{
        id: String(Date.now()), jobCode: `JO-${1010 + prev.length}`,
        filledVacancies: 0, applications: 0, interviews: 0, offers: 0,
        postedDate: new Date().toISOString().split("T")[0], ...base,
      }, ...prev]);
    }
    setEditJob(null);
  }

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Job Tracker</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            {jobs.length} job orders · {openCount} open · {urgentCount} urgent
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-1 rounded-xl border" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
            {(["kanban", "list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all capitalize"
                style={{ backgroundColor: view === v ? "#6366F1" : "transparent", color: view === v ? "#fff" : "var(--bz-text-3)" }}>
                {v === "kanban" ? "🗂 Board" : "☰ List"}
              </button>
            ))}
          </div>
          <button onClick={() => { setEditJob(null); setModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12.5px] font-semibold text-white shadow-lg"
            style={{ background: "var(--bz-gradient)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Post Job
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open Positions",    value: openCount,        sub: "Active orders",   color: "#6366F1", icon: "📋" },
          { label: "Total Vacancies",   value: `${filledVacancies}/${totalVacancies}`, sub: "Filled",  color: "#10B981", icon: "👥" },
          { label: "Urgent Orders",     value: urgentCount,      sub: "High priority",   color: "#EF4444", icon: "🚨" },
          { label: "Filled This Month", value: filledCount,      sub: "Job orders",      color: "#8B5CF6", icon: "✅" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}18`, color: c.color }}>{c.sub}</span>
            </div>
            <p className="text-[22px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search jobs…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
            style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
        </div>
        {/* Status */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-lg px-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as JobStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
        {/* Priority */}
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)}
          className="h-9 rounded-lg px-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30"
          style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
          <option value="all">All Priorities</option>
          {(["urgent","high","medium","low"] as JobPriority[]).map(p => <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>)}
        </select>
      </div>

      {/* ── KANBAN VIEW ──────────────────────────────────────────────────────── */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "400px" }}>
          {KANBAN_COLUMNS.map(status => {
            const colJobs = filtered.filter(j => j.status === status);
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={status} className="shrink-0 rounded-xl border flex flex-col" style={{ width: "290px", backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
                {/* Column Header */}
                <div className="flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: `${cfg.color}0a` }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="text-[12px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{colJobs.length}</span>
                </div>
                {/* Cards */}
                <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto" style={{ maxHeight: "620px" }}>
                  {colJobs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>No jobs</p>
                    </div>
                  )}
                  {colJobs.map(j => <KanbanCard key={j.id} job={j} onEdit={j => { setEditJob(j); setModalOpen(true); }} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIST VIEW ────────────────────────────────────────────────────────── */}
      {view === "list" && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="hidden sm:grid grid-cols-[90px_1fr_130px_90px_100px_110px_90px_80px] gap-3 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
            <span>Job ID</span><span>Position</span><span>Client</span><span>Vacancies</span><span>Priority</span><span>Status</span><span>Deadline</span><span>Actions</span>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-14">
              <span className="text-4xl">🗂️</span>
              <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No job orders match your filter</p>
            </div>
          )}

          {filtered.map(j => {
            const daysLeft = Math.ceil((new Date(j.deadline).getTime() - Date.now()) / 86400000);
            return (
              <div key={j.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                {/* Mobile */}
                <div className="sm:hidden px-4 py-3 hover:bg-[rgba(99,102,241,0.02)]" style={{ borderLeft: `3px solid ${PRIORITY_CONFIG[j.priority].color}` }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="text-[11px] font-bold" style={{ color: "#6366F1" }}>{j.jobCode}</span>
                      <p className="text-[13px] font-bold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{j.title}</p>
                      <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{j.clientName} · {j.location}</p>
                    </div>
                    <StatusPill status={j.status} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <PriorityDot priority={j.priority} />
                      <span className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{j.filledVacancies}/{j.vacancies} filled</span>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/jobs/${j.id}`}><button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></Link>
                      <button onClick={() => { setEditJob(j); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    </div>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[90px_1fr_130px_90px_100px_110px_90px_80px] gap-3 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]"
                  style={{ borderLeft: `3px solid ${PRIORITY_CONFIG[j.priority].color}` }}>
                  <span className="text-[11.5px] font-bold" style={{ color: "#6366F1" }}>{j.jobCode}</span>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{j.title}</p>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{j.location}, {j.country}</p>
                  </div>
                  <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{j.clientName}</span>
                  <FillProgress filled={j.filledVacancies} total={j.vacancies} />
                  <PriorityDot priority={j.priority} />
                  <StatusPill status={j.status} />
                  <span className="text-[11.5px]" style={{ color: daysLeft < 0 ? "#EF4444" : daysLeft <= 7 ? "#F59E0B" : "var(--bz-text-2)" }}>
                    {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/jobs/${j.id}`}><button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "#6366F1" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></Link>
                    <button onClick={() => { setEditJob(j); setModalOpen(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-2)" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <JobModal open={modalOpen} onClose={() => { setModalOpen(false); setEditJob(null); }} onSave={handleSave} job={editJob} mode={editJob ? "edit" : "add"} />
    </div>
  );
}
