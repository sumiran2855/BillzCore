"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { mockJobs, JobStatus, STATUS_CONFIG, PRIORITY_CONFIG, JOB_TYPE_LABELS } from "./jobTypes";
import JobModal from "./jobModal";

const TABS = ["overview", "pipeline", "details"] as const;
type Tab = typeof TABS[number];

const PIPELINE_STAGES = [
  { key: "applications", label: "Applications", icon: "📥", color: "#6366F1" },
  { key: "interviews",   label: "Interviews",   icon: "🎤", color: "#F59E0B" },
  { key: "offers",       label: "Offers Made",  icon: "📄", color: "#8B5CF6" },
  { key: "filled",       label: "Filled",       icon: "✅", color: "#10B981" },
];

export default function JobDetailPage() {
  const params = useParams();
  const [jobs, setJobs] = useState(mockJobs);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const job = jobs.find(j => j.id === params?.id);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">🗂️</span>
        <p className="text-[15px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Job order not found</p>
        <Link href="/dashboard/jobs"><button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>← Back to Jobs</button></Link>
      </div>
    );
  }

  const sc = STATUS_CONFIG[job.status];
  const pc = PRIORITY_CONFIG[job.priority];
  const fillPct = job.vacancies > 0 ? Math.round((job.filledVacancies / job.vacancies) * 100) : 0;
  const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 86400000);

  function handleSave(form: any) {
    setJobs(prev => prev.map(j => j.id === job!.id
      ? { ...j, ...form, vacancies: Number(form.vacancies), salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax), tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) }
      : j));
  }

  function markAs(status: JobStatus) {
    setJobs(prev => prev.map(j => j.id === job!.id ? { ...j, status } : j));
  }

  const pipelineValues: Record<string, number> = {
    applications: job.applications,
    interviews: job.interviews,
    offers: job.offers,
    filled: job.filledVacancies,
  };
  const maxPipeline = Math.max(...Object.values(pipelineValues), 1);

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--bz-text-3)" }}>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link><span>/</span>
        <Link href="/dashboard/jobs" className="hover:underline">Job Tracker</Link><span>/</span>
        <span style={{ color: "var(--bz-text-1)" }}>{job.jobCode}</span>
      </div>

      {/* Hero Card */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="h-1.5" style={{ backgroundColor: pc.color }} />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-[12.5px] font-bold" style={{ color: "#6366F1" }}>{job.jobCode}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: sc.bg, color: sc.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sc.color }} />{sc.label}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: pc.bg, color: pc.color }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: pc.color }} />{pc.label}
                </span>
              </div>
              <h1 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>{job.title}</h1>
              <p className="text-[13px] font-semibold mt-1" style={{ color: "var(--bz-text-2)" }}>{job.clientName} · {job.department}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>
                <span>📍 {job.location}, {job.country}</span>
                <span>💼 {JOB_TYPE_LABELS[job.jobType]}</span>
                <span>👤 {job.assignedTo}</span>
                <span style={{ color: daysLeft < 0 ? "#EF4444" : daysLeft <= 7 ? "#F59E0B" : "var(--bz-text-3)" }}>
                  ⏳ {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                </span>
              </div>
              {/* Tags */}
              {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.tags.map(tag => (
                    <span key={tag} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full border"
                      style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
            {/* Salary + actions */}
            <div className="flex flex-col items-start sm:items-end gap-3">
              <div className="rounded-xl border px-4 py-3 text-left sm:text-right" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
                <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Salary Range</p>
                <p className="text-[16px] font-extrabold" style={{ color: "#6366F1" }}>
                  {job.currency} {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}
                </p>
                <p className="text-[10.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{job.vacancies} Vacancies · Deadline {job.deadline}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.status !== "filled" && job.status !== "cancelled" && (
                  <button onClick={() => markAs("filled")} className="px-3 py-2 rounded-lg text-[12px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                    Mark Filled
                  </button>
                )}
                {job.status === "on_hold" && (
                  <button onClick={() => markAs("open")} className="px-3 py-2 rounded-lg text-[12px] font-semibold border" style={{ borderColor: "#6366F1", color: "#6366F1" }}>Reactivate</button>
                )}
                {job.status === "open" && (
                  <button onClick={() => markAs("on_hold")} className="px-3 py-2 rounded-lg text-[12px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Hold</button>
                )}
                <button onClick={() => setEditOpen(true)} className="px-3 py-2 rounded-lg text-[12px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Edit</button>
              </div>
            </div>
          </div>

          {/* Fill progress */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div className="flex justify-between text-[12px] mb-1.5" style={{ color: "var(--bz-text-3)" }}>
              <span>Vacancy Fill Rate</span>
              <span className="font-bold" style={{ color: fillPct === 100 ? "#10B981" : "#6366F1" }}>{job.filledVacancies} / {job.vacancies} ({fillPct}%)</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${fillPct}%`, background: fillPct === 100 ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#6366F1,#818CF8)" }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t overflow-x-auto px-2 sm:px-5" style={{ borderColor: "var(--bz-border-hard)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 sm:px-4 py-3 text-[12px] sm:text-[12.5px] font-semibold capitalize border-b-2 transition-all shrink-0"
              style={{ borderBottomColor: activeTab === tab ? "#6366F1" : "transparent", color: activeTab === tab ? "#6366F1" : "var(--bz-text-3)" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-4">
            {/* Description */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Job Description</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--bz-text-2)" }}>{job.description}</p>
            </div>
            {/* Requirements */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Requirements</p>
              <ul className="space-y-1.5">
                {job.requirements.split("\n").filter(Boolean).map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>
                    <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#6366F1" }} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pipeline mini */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Candidate Pipeline</p>
              <div className="space-y-3">
                {PIPELINE_STAGES.map(s => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] flex items-center gap-1.5" style={{ color: "var(--bz-text-2)" }}>{s.icon} {s.label}</span>
                      <span className="text-[12.5px] font-bold" style={{ color: s.color }}>{pipelineValues[s.key]}</span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round((pipelineValues[s.key] / maxPipeline) * 100)}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Quick Actions</p>
              <div className="space-y-2">
                {job.status !== "in_progress" && job.status !== "filled" && job.status !== "cancelled" && (
                  <button onClick={() => markAs("in_progress")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Start Sourcing
                  </button>
                )}
                {job.status === "in_progress" && (
                  <button onClick={() => markAs("interviewing")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "#F59E0B", color: "#F59E0B" }}>
                    Move to Interviewing
                  </button>
                )}
                {job.status === "interviewing" && (
                  <button onClick={() => markAs("offer_stage")} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "#8B5CF6", color: "#8B5CF6" }}>
                    Move to Offer Stage
                  </button>
                )}
                <button onClick={() => setEditOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Job Order
                </button>
              </div>
            </div>

            {/* Job Info */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Job Info</p>
              {[
                { label: "Posted",    value: job.postedDate },
                { label: "Deadline",  value: job.deadline },
                { label: "Recruiter", value: job.assignedTo },
                { label: "Type",      value: JOB_TYPE_LABELS[job.jobType] },
                { label: "Currency",  value: job.currency },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b last:border-b-0 text-[12px]" style={{ borderColor: "var(--bz-border-hard)" }}>
                  <span style={{ color: "var(--bz-text-3)" }}>{r.label}</span>
                  <span className="font-semibold" style={{ color: "var(--bz-text-1)" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PIPELINE TAB */}
      {activeTab === "pipeline" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PIPELINE_STAGES.map(s => (
            <div key={s.key} className="rounded-xl border p-5 text-center" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <span className="text-3xl">{s.icon}</span>
              <p className="text-[28px] font-extrabold mt-2" style={{ color: s.color }}>{pipelineValues[s.key]}</p>
              <p className="text-[12px] font-semibold mt-1" style={{ color: "var(--bz-text-1)" }}>{s.label}</p>
              <div className="mt-3 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round((pipelineValues[s.key] / maxPipeline) * 100)}%`, backgroundColor: s.color }} />
              </div>
              {s.key !== "applications" && (
                <p className="text-[10.5px] mt-1.5" style={{ color: "var(--bz-text-3)" }}>
                  {job.applications > 0 ? `${Math.round(pipelineValues[s.key] / job.applications * 100)}% of applicants` : "—"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DETAILS TAB */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Job Code",      value: job.jobCode },
            { label: "Client",        value: job.clientName },
            { label: "Department",    value: job.department },
            { label: "Location",      value: `${job.location}, ${job.country}` },
            { label: "Job Type",      value: JOB_TYPE_LABELS[job.jobType] },
            { label: "Status",        value: STATUS_CONFIG[job.status].label },
            { label: "Priority",      value: PRIORITY_CONFIG[job.priority].label },
            { label: "Vacancies",     value: `${job.vacancies} (${job.filledVacancies} filled)` },
            { label: "Salary Range",  value: `${job.currency} ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}` },
            { label: "Posted Date",   value: job.postedDate },
            { label: "Deadline",      value: job.deadline },
            { label: "Assigned To",   value: job.assignedTo },
          ].map(r => (
            <div key={r.label} className="rounded-xl border px-4 py-3" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{r.label}</p>
              <p className="text-[13.5px] font-semibold mt-0.5" style={{ color: "var(--bz-text-1)" }}>{r.value}</p>
            </div>
          ))}
        </div>
      )}

      <JobModal open={editOpen} onClose={() => setEditOpen(false)} onSave={handleSave} job={job} mode="edit" />
    </div>
  );
}
