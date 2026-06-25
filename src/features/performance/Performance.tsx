"use client";

import { useState } from "react";
import {
  PerformancePeriod, PERIOD_LABELS, recruiterMetrics, pipelineStages,
  kpiTrends, placementsByIndustry, timeToFillData,
} from "./performanceTypes";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pct(val: number, max: number) { return Math.min(100, Math.round((val / max) * 100)); }

function TrendBadge({ current, previous, unit, lowerIsBetter = false }: { current: number; previous: number; unit: string; lowerIsBetter?: boolean }) {
  const delta = current - previous;
  const positive = lowerIsBetter ? delta < 0 : delta > 0;
  const pctChange = previous > 0 ? Math.abs(Math.round((delta / previous) * 100)) : 0;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ backgroundColor: positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: positive ? "#10B981" : "#EF4444" }}>
      {positive ? "▲" : "▼"} {pctChange}%
    </span>
  );
}

function RadialScore({ value, color, size = 56 }: { value: number; color: string; size?: number }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bz-border-hard)" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle"
        className="rotate-90" transform={`rotate(90,${size / 2},${size / 2})`}
        style={{ fill: color, fontSize: "11px", fontWeight: 700 }}>
        {value}
      </text>
    </svg>
  );
}

function Bar({ value, max, color, height = 8 }: { value: number; max: number; color: string; height?: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: `${height}px`, backgroundColor: "var(--bz-border-hard)" }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct(value, max)}%`, backgroundColor: color }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PerformancePage() {
  const [period, setPeriod] = useState<PerformancePeriod>("this_month");
  const [selectedRecruiter, setSelectedRecruiter] = useState<string | null>(null);

  const maxPlacements = Math.max(...recruiterMetrics.map(r => r.target_placements));
  const maxRevenue = Math.max(...recruiterMetrics.map(r => r.target_revenue));
  const maxPipelineCount = Math.max(...pipelineStages.map(s => s.count));
  const maxIndustryPlacements = Math.max(...placementsByIndustry.map(p => p.placements));
  const maxTTF = Math.max(...timeToFillData.map(d => Math.max(d.days, d.target)));

  const selected = selectedRecruiter ? recruiterMetrics.find(r => r.id === selectedRecruiter) : null;
  const totalPlacements = recruiterMetrics.reduce((s, r) => s + r.placements, 0);
  const avgSatisfaction = Math.round(recruiterMetrics.reduce((s, r) => s + r.client_satisfaction, 0) / recruiterMetrics.length);
  const avgTTF = Math.round(recruiterMetrics.reduce((s, r) => s + r.time_to_fill, 0) / recruiterMetrics.length);
  const totalRevenue = recruiterMetrics.reduce((s, r) => s + r.revenue, 0);

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Performance</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Recruiter KPIs, pipeline health and placement analytics</p>
        </div>
        {/* Period switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border shrink-0" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
          {(Object.keys(PERIOD_LABELS) as PerformancePeriod[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] sm:text-[11.5px] font-semibold transition-all whitespace-nowrap"
              style={{ backgroundColor: period === p ? "#6366F1" : "transparent", color: period === p ? "#fff" : "var(--bz-text-3)" }}>
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Trend Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiTrends.map(k => (
          <div key={k.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{k.label}</p>
              <TrendBadge current={k.current} previous={k.previous} unit={k.unit} lowerIsBetter={k.label.includes("Time")} />
            </div>
            <p className="text-[22px] sm:text-[24px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{k.current}{k.unit}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>vs {k.previous}{k.unit} prior period</p>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel + Industry Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Pipeline Funnel */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "var(--bz-text-1)" }}>Candidate Pipeline Funnel</p>
          <div className="space-y-3">
            {pipelineStages.map((stage, i) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                    <span className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold" style={{ color: stage.color }}>{stage.count}</span>
                    {i > 0 && (
                      <span className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>
                        ({Math.round(stage.count / pipelineStages[i - 1].count * 100)}% pass)
                      </span>
                    )}
                  </div>
                </div>
                <Bar value={stage.count} max={maxPipelineCount} color={stage.color} height={10} />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between text-[12px]" style={{ borderColor: "var(--bz-border-hard)" }}>
            <span style={{ color: "var(--bz-text-3)" }}>Overall conversion</span>
            <span className="font-bold" style={{ color: "#10B981" }}>
              {Math.round(pipelineStages[pipelineStages.length - 1].count / pipelineStages[0].count * 100)}% (App → Placed)
            </span>
          </div>
        </div>

        {/* Placements by Industry */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "var(--bz-text-1)" }}>Placements by Industry</p>
          <div className="space-y-3.5">
            {placementsByIndustry.map(p => (
              <div key={p.industry}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{p.industry}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold" style={{ color: p.color }}>{p.placements}</span>
                    <span className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>
                      {Math.round(p.placements / totalPlacements * 100)}%
                    </span>
                  </div>
                </div>
                <Bar value={p.placements} max={maxIndustryPlacements} color={p.color} height={10} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time to Fill Chart */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Avg Time to Fill (Days)</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1" style={{ color: "var(--bz-text-3)" }}><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#6366F1" }} />Actual</span>
            <span className="flex items-center gap-1" style={{ color: "var(--bz-text-3)" }}><span className="h-2.5 w-2.5 rounded-sm opacity-30" style={{ backgroundColor: "#6366F1" }} />Target (25d)</span>
          </div>
        </div>
        <div className="flex items-end gap-3 sm:gap-5" style={{ height: "140px" }}>
          {timeToFillData.map(d => {
            const actH = Math.round((d.days / maxTTF) * 120);
            const tarH = Math.round((d.target / maxTTF) * 120);
            const onTarget = d.days <= d.target;
            return (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10.5px] font-bold mb-1" style={{ color: onTarget ? "#10B981" : "#EF4444" }}>{d.days}d</span>
                <div className="w-full flex items-end gap-0.5" style={{ height: "100px" }}>
                  <div className="flex-1 rounded-t-md opacity-20" style={{ height: `${tarH}px`, backgroundColor: "#6366F1" }} />
                  <div className="flex-1 rounded-t-md transition-all" style={{ height: `${actH}px`, backgroundColor: onTarget ? "#10B981" : "#EF4444" }} />
                </div>
                <span className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruiter Scorecards */}
      <div>
        <p className="text-[14px] font-bold mb-3" style={{ color: "var(--bz-text-1)" }}>Recruiter Scorecards</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {recruiterMetrics.map(r => {
            const placementPct = pct(r.placements, r.target_placements);
            const revenuePct = pct(r.revenue, r.target_revenue);
            const isSelected = selectedRecruiter === r.id;
            const offerAcceptRate = Math.round(r.offers_accepted / r.offers_made * 100);
            return (
              <div key={r.id} onClick={() => setSelectedRecruiter(isSelected ? null : r.id)}
                className="rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--bz-card-bg)", borderColor: isSelected ? r.avatar_color : "var(--bz-border-hard)",
                  boxShadow: isSelected ? `0 0 0 2px ${r.avatar_color}40` : undefined,
                }}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-[12px] font-extrabold"
                    style={{ background: `linear-gradient(135deg,${r.avatar_color},${r.avatar_color}bb)` }}>{r.initials}</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: "var(--bz-text-1)" }}>{r.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{r.role}</p>
                  </div>
                </div>

                {/* Score rings */}
                <div className="flex items-center justify-around mb-4">
                  <div className="flex flex-col items-center gap-1">
                    <RadialScore value={r.candidate_quality_score} color="#6366F1" size={52} />
                    <span className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>Quality</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RadialScore value={r.client_satisfaction} color="#10B981" size={52} />
                    <span className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>Satisfaction</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RadialScore value={offerAcceptRate} color="#F59E0B" size={52} />
                    <span className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>Offer Acc.</span>
                  </div>
                </div>

                {/* Placements progress */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: "var(--bz-text-3)" }}>Placements</span>
                      <span className="font-bold" style={{ color: r.avatar_color }}>{r.placements}/{r.target_placements}</span>
                    </div>
                    <Bar value={r.placements} max={r.target_placements} color={r.avatar_color} height={7} />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: "var(--bz-text-3)" }}>Revenue</span>
                      <span className="font-bold" style={{ color: r.avatar_color }}>{revenuePct}%</span>
                    </div>
                    <Bar value={r.revenue} max={r.target_revenue} color={r.avatar_color} height={7} />
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-1 text-center" style={{ borderColor: "var(--bz-border-hard)" }}>
                  {[
                    { label: "TTF", value: `${r.time_to_fill}d` },
                    { label: "Interviews", value: r.interviews_conducted },
                    { label: "Reqs", value: r.active_requisitions },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-[12px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{s.value}</p>
                      <p className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruiter Detail Expanded */}
      {selected && (
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: selected.avatar_color + "66" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-[12px] font-extrabold"
                style={{ background: `linear-gradient(135deg,${selected.avatar_color},${selected.avatar_color}bb)` }}>{selected.initials}</span>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{selected.name} — Detailed Stats</p>
                <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{selected.role}</p>
              </div>
            </div>
            <button onClick={() => setSelectedRecruiter(null)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(0,0,0,0.06)]" style={{ color: "var(--bz-text-3)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Placements",          value: `${selected.placements} / ${selected.target_placements}`, color: selected.avatar_color },
              { label: "Revenue Generated",   value: selected.revenue.toLocaleString(),                        color: "#6366F1" },
              { label: "Interviews Conducted",value: String(selected.interviews_conducted),                    color: "#8B5CF6" },
              { label: "Offers Made",         value: String(selected.offers_made),                             color: "#F59E0B" },
              { label: "Offers Accepted",     value: `${selected.offers_accepted} (${Math.round(selected.offers_accepted / selected.offers_made * 100)}%)`, color: "#10B981" },
              { label: "Active Requisitions", value: String(selected.active_requisitions),                     color: "#06B6D4" },
              { label: "Avg Time to Fill",    value: `${selected.time_to_fill} days`,                         color: "#EC4899" },
              { label: "Client Satisfaction", value: `${selected.client_satisfaction}%`,                      color: "#10B981" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3" style={{ backgroundColor: "var(--bz-bg)" }}>
                <p className="text-[14px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Summary Row */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <p className="text-[13px] font-bold mb-4" style={{ color: "var(--bz-text-1)" }}>Team Summary — {PERIOD_LABELS[period]}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Placements",    value: totalPlacements, suffix: "", color: "#6366F1" },
            { label: "Total Revenue",       value: totalRevenue.toLocaleString(), suffix: "", color: "#10B981" },
            { label: "Avg Client Sat.",     value: avgSatisfaction, suffix: "%", color: "#8B5CF6" },
            { label: "Avg Time to Fill",    value: avgTTF, suffix: "d", color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl p-4" style={{ backgroundColor: "var(--bz-bg)" }}>
              <p className="text-[22px] font-extrabold" style={{ color: s.color }}>{s.value}{s.suffix}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
