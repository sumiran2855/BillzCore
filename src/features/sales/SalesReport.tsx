"use client";

import { useState } from "react";
import {
  Period, periodDataMap, topClients, topManagers, salesDeals, SalesDataPoint,
} from "./salesTypes";

const PERIODS: { key: Period; label: string }[] = [
  { key: "daily",     label: "Daily"     },
  { key: "weekly",    label: "Weekly"    },
  { key: "monthly",   label: "Monthly"   },
  { key: "quarterly", label: "Quarterly" },
  { key: "yearly",    label: "Yearly"    },
];

const DEAL_STATUS = {
  won:  { label: "Won",  color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  lost: { label: "Lost", color: "#EF4444", bg: "rgba(239,68,68,0.1)"   },
  open: { label: "Open", color: "#6366F1", bg: "rgba(99,102,241,0.1)"  },
};

function KPI({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>{sub}</span>
      </div>
      <p className="text-[20px] sm:text-[22px] font-extrabold mt-1" style={{ color }}>{value}</p>
      <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{label}</p>
    </div>
  );
}

function BarChart({ data, period }: { data: SalesDataPoint[]; period: Period }) {
  const maxRev = Math.max(...data.map(d => Math.max(d.revenue, d.target)));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-end gap-1 sm:gap-2" style={{ minWidth: data.length > 8 ? `${data.length * 48}px` : undefined, height: "180px", padding: "0 4px" }}>
        {data.map((d, i) => {
          const revH = Math.round((d.revenue / maxRev) * 160);
          const tarH = Math.round((d.target / maxRev) * 160);
          const hit = d.revenue >= d.target;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer relative group"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {/* Tooltip */}
              {hovered === i && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 rounded-lg border px-3 py-2 text-[11px] whitespace-nowrap shadow-xl"
                  style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }}>
                  <p className="font-bold">{d.label}</p>
                  <p style={{ color: "#6366F1" }}>Rev: {d.revenue.toLocaleString()}</p>
                  <p style={{ color: "var(--bz-text-3)" }}>Target: {d.target.toLocaleString()}</p>
                  <p style={{ color: "#10B981" }}>Deals: {d.deals} · Placed: {d.placements}</p>
                </div>
              )}
              {/* Bars */}
              <div className="w-full flex items-end gap-px" style={{ height: "160px" }}>
                {/* Target line bar (ghost) */}
                <div className="flex-1 rounded-t-md opacity-20" style={{ height: `${tarH}px`, backgroundColor: "#6366F1" }} />
                {/* Revenue bar */}
                <div className="flex-1 rounded-t-md transition-all duration-300"
                  style={{ height: `${revH}px`, background: hit ? "linear-gradient(to top,#10B981,#34D399)" : "linear-gradient(to top,#6366F1,#818CF8)" }} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium" style={{ color: "var(--bz-text-3)" }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniSparkBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.round((value / max) * 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-bold w-16 text-right shrink-0" style={{ color }}>{value.toLocaleString()}</span>
    </div>
  );
}

export default function SalesReportPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [dealStatus, setDealStatus] = useState<"all" | "won" | "lost" | "open">("all");

  const data = periodDataMap[period];
  const totalRevenue  = data.reduce((s, d) => s + d.revenue, 0);
  const totalDeals    = data.reduce((s, d) => s + d.deals, 0);
  const totalPlaced   = data.reduce((s, d) => s + d.placements, 0);
  const totalTarget   = data.reduce((s, d) => s + d.target, 0);
  const targetPct     = totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0;
  const maxClientRev  = Math.max(...topClients.map(c => c.revenue));
  const maxMgrRev     = Math.max(...topManagers.map(m => m.revenue));

  const filteredDeals = dealStatus === "all" ? salesDeals : salesDeals.filter(d => d.status === dealStatus);
  const wonDeals  = salesDeals.filter(d => d.status === "won").length;
  const lostDeals = salesDeals.filter(d => d.status === "lost").length;
  const winRate   = wonDeals + lostDeals > 0 ? Math.round(wonDeals / (wonDeals + lostDeals) * 100) : 0;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Sales Report</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Revenue performance, deal tracking and team analytics</p>
        </div>
        {/* Period Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border shrink-0" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11.5px] sm:text-[12px] font-semibold transition-all"
              style={{
                backgroundColor: period === p.key ? "#6366F1" : "transparent",
                color: period === p.key ? "#fff" : "var(--bz-text-3)",
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Total Revenue"   value={totalRevenue.toLocaleString()} sub={`${targetPct}% of target`}  color="#6366F1" icon="💰" />
        <KPI label="Deals Closed"    value={String(totalDeals)}            sub={`${winRate}% win rate`}      color="#10B981" icon="🤝" />
        <KPI label="Placements Made" value={String(totalPlaced)}           sub="Candidates placed"           color="#8B5CF6" icon="👥" />
        <KPI label="Target Gap"      value={Math.max(0, totalTarget - totalRevenue).toLocaleString()} sub={targetPct >= 100 ? "Target hit! 🎉" : "Remaining"} color={targetPct >= 100 ? "#10B981" : "#F59E0B"} icon="🎯" />
      </div>

      {/* Target progress bar */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>Revenue vs Target</span>
          <div className="flex items-center gap-3 text-[11.5px]">
            <span style={{ color: "var(--bz-text-3)" }}>Target: <b style={{ color: "var(--bz-text-1)" }}>{totalTarget.toLocaleString()}</b></span>
            <span style={{ color: "var(--bz-text-3)" }}>Achieved: <b style={{ color: "#6366F1" }}>{totalRevenue.toLocaleString()}</b></span>
            <span className="font-bold" style={{ color: targetPct >= 100 ? "#10B981" : "#F59E0B" }}>{targetPct}%</span>
          </div>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, targetPct)}%`, background: targetPct >= 100 ? "linear-gradient(90deg,#10B981,#34D399)" : "linear-gradient(90deg,#6366F1,#818CF8)" }} />
        </div>
      </div>

      {/* Main Chart */}
      <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Revenue Chart — {PERIODS.find(p => p.key === period)?.label}</p>
          <div className="flex items-center gap-3 text-[11px]">
            {[{ l: "Revenue", c: "#6366F1" }, { l: "Target (ghost)", c: "#6366F120" }, { l: "On/above target", c: "#10B981" }].map(i => (
              <span key={i.l} className="flex items-center gap-1" style={{ color: "var(--bz-text-3)" }}>
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: i.c }} />{i.l}
              </span>
            ))}
          </div>
        </div>
        <BarChart data={data} period={period} />
      </div>

      {/* Top Clients + Top Managers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Top Clients */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "var(--bz-text-1)" }}>Top Clients by Revenue</p>
          <div className="space-y-3.5">
            {topClients.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-extrabold"
                      style={{ background: ["#6366F1","#8B5CF6","#10B981","#F59E0B","#EF4444"][i] }}>
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: c.growth >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: c.growth >= 0 ? "#10B981" : "#EF4444" }}>
                      {c.growth >= 0 ? "▲" : "▼"} {Math.abs(c.growth)}%
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{c.deals} deals</span>
                  </div>
                </div>
                <MiniSparkBar value={c.revenue} max={maxClientRev} color={["#6366F1","#8B5CF6","#10B981","#F59E0B","#EF4444"][i]} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Managers */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <p className="text-[13px] font-bold mb-4" style={{ color: "var(--bz-text-1)" }}>Account Manager Performance</p>
          <div className="space-y-5">
            {topManagers.map((m, i) => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-extrabold"
                      style={{ background: ["var(--bz-gradient)","linear-gradient(135deg,#8B5CF6,#6366F1)","linear-gradient(135deg,#10B981,#059669)"][i] }}>
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </span>
                    <div>
                      <p className="text-[12.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>{m.name}</p>
                      <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>{m.deals} deals · {m.closingRate}% close rate</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-extrabold" style={{ color: "#6366F1" }}>{m.revenue.toLocaleString()}</span>
                </div>
                {/* Close rate bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] w-20 shrink-0" style={{ color: "var(--bz-text-3)" }}>Close rate</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                    <div className="h-full rounded-full" style={{ width: `${m.closingRate}%`, background: "var(--bz-gradient)" }} />
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: "#6366F1" }}>{m.closingRate}%</span>
                </div>
                {/* Revenue bar */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10.5px] w-20 shrink-0" style={{ color: "var(--bz-text-3)" }}>Revenue</span>
                  <MiniSparkBar value={m.revenue} max={maxMgrRev} color="#8B5CF6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b flex-wrap gap-3" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
          <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Recent Deals</p>
          <div className="flex items-center gap-1.5">
            {(["all", "won", "lost", "open"] as const).map(s => (
              <button key={s} onClick={() => setDealStatus(s)}
                className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold transition-all capitalize"
                style={{
                  backgroundColor: dealStatus === s ? (s === "all" ? "#6366F1" : DEAL_STATUS[s as keyof typeof DEAL_STATUS]?.color || "#6366F1") : "transparent",
                  color: dealStatus === s ? "#fff" : "var(--bz-text-3)",
                  border: "1px solid var(--bz-border-hard)",
                }}>
                {s === "all" ? `All (${salesDeals.length})` : `${DEAL_STATUS[s].label} (${salesDeals.filter(d => d.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[110px_1fr_130px_110px_80px_90px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>
          <span>Date</span><span>Description</span><span>Manager</span><span>Value</span><span>Placed</span><span>Status</span>
        </div>

        {filteredDeals.map(deal => {
          const sc = DEAL_STATUS[deal.status];
          return (
            <div key={deal.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
              {/* Mobile */}
              <div className="sm:hidden px-4 py-3 hover:bg-[rgba(99,102,241,0.02)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{deal.client}</p>
                    <p className="text-[11.5px] mt-0.5 truncate" style={{ color: "var(--bz-text-3)" }}>{deal.description}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{deal.date} · {deal.manager}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{deal.currency} {deal.value.toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold mt-1" style={{ backgroundColor: sc.bg, color: sc.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sc.color }} />{sc.label}
                    </span>
                  </div>
                </div>
              </div>
              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-[110px_1fr_130px_110px_80px_90px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]">
                <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{deal.date}</span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{deal.client}</p>
                  <p className="text-[11.5px] truncate" style={{ color: "var(--bz-text-3)" }}>{deal.description}</p>
                </div>
                <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{deal.manager}</span>
                <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>{deal.currency} {deal.value.toLocaleString()}</span>
                <span className="text-[12.5px] font-semibold text-center" style={{ color: "var(--bz-text-2)" }}>{deal.placements || "—"}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold w-fit" style={{ backgroundColor: sc.bg, color: sc.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: sc.color }} />
                  {sc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
