"use client";

import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const topStats = [
  {
    label: "Active Candidates",
    value: "284",
    change: "+8",
    up: true,
    sub: "new this week",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    label: "Active Clients",
    value: "63",
    change: "+5",
    up: true,
    sub: "added this month",
    color: "#10B981",
    bg: "rgba(16,185,129,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  },
  {
    label: "Total Sales",
    value: "₹48.0L",
    change: "+14.2%",
    up: true,
    sub: "vs last month",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
  },
  {
    label: "Outstanding",
    value: "₹10.3L",
    change: "-6.1%",
    up: false,
    sub: "pending collection",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  },
  {
    label: "Profit",
    value: "₹30.2L",
    change: "+9.8%",
    up: true,
    sub: "net after expenses",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  },
];

const bottomStats = [
  {
    label: "Expenses",
    value: "₹7.5L",
    change: "+3.2%",
    up: false,
    sub: "this month",
    color: "#F97316",
    bg: "rgba(249,115,22,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  },
  {
    label: "Credits",
    value: "₹0.6L",
    change: "+1.1%",
    up: true,
    sub: "available balance",
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  },
  {
    label: "Work Permits",
    value: "15",
    change: "30 days",
    up: false,
    sub: "expiring soon",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    warning: true,
  },
  {
    label: "Medicals",
    value: "15",
    change: "30 days",
    up: false,
    sub: "expiring soon",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    warning: true,
  },
  {
    label: "Insurance",
    value: "11",
    change: "30 days",
    up: false,
    sub: "expiring soon",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    warning: true,
  },
  {
    label: "Open Invoices",
    value: "18",
    change: "-3",
    up: true,
    sub: "from last month",
    color: "#10B981",
    bg: "rgba(16,185,129,0.10)",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  },
];

const revenueData = [
  { month: "Jan", revenue: 32, expenses: 18, profit: 14 },
  { month: "Feb", revenue: 41, expenses: 22, profit: 19 },
  { month: "Mar", revenue: 38, expenses: 20, profit: 18 },
  { month: "Apr", revenue: 55, expenses: 28, profit: 27 },
  { month: "May", revenue: 48, expenses: 24, profit: 24 },
  { month: "Jun", revenue: 63, expenses: 30, profit: 33 },
  { month: "Jul", revenue: 57, expenses: 27, profit: 30 },
  { month: "Aug", revenue: 72, expenses: 34, profit: 38 },
  { month: "Sep", revenue: 68, expenses: 31, profit: 37 },
  { month: "Oct", revenue: 80, expenses: 36, profit: 44 },
  { month: "Nov", revenue: 74, expenses: 33, profit: 41 },
  { month: "Dec", revenue: 91, expenses: 38, profit: 53 },
];

const monthlySales = [
  { month: "Jan", value: 28 },
  { month: "Feb", value: 35 },
  { month: "Mar", value: 30 },
  { month: "Apr", value: 48 },
  { month: "May", value: 42 },
  { month: "Jun", value: 58 },
  { month: "Jul", value: 52 },
  { month: "Aug", value: 67 },
  { month: "Sep", value: 61 },
  { month: "Oct", value: 75 },
  { month: "Nov", value: 69 },
  { month: "Dec", value: 84 },
];

const profitTrend = [22, 28, 19, 35, 40, 33, 45, 38, 50, 47, 55, 62];

const recentPayments = [
  { id: "PAY-0091", client: "Acme Corp", amount: "₹1,24,000", date: "Jun 24", method: "Bank Transfer", color: "#10B981" },
  { id: "PAY-0090", client: "TechStart Ltd", amount: "₹86,500", date: "Jun 22", method: "UPI", color: "#6366F1" },
  { id: "PAY-0089", client: "Nexus Co", amount: "₹45,000", date: "Jun 20", method: "Cheque", color: "#10B981" },
  { id: "PAY-0088", client: "BrightWave", amount: "₹2,10,000", date: "Jun 18", method: "NEFT", color: "#8B5CF6" },
  { id: "PAY-0087", client: "Orion Systems", amount: "₹67,800", date: "Jun 15", method: "Bank Transfer", color: "#06B6D4" },
];

const overdueAccounts = [
  { client: "Globex Inc", amount: "₹2,10,000", dueDate: "May 15", days: 40, risk: "High" },
  { client: "ZenTech Pvt", amount: "₹98,000", dueDate: "May 28", days: 27, risk: "High" },
  { client: "Pinnacle Corp", amount: "₹54,500", dueDate: "Jun 5", days: 19, risk: "Medium" },
  { client: "BlueStar Ltd", amount: "₹32,000", dueDate: "Jun 10", days: 14, risk: "Medium" },
  { client: "Crest Pvt Ltd", amount: "₹18,200", dueDate: "Jun 18", days: 6, risk: "Low" },
];

const jobPipeline = [
  { label: "Applied", count: 124, color: "#8B5CF6" },
  { label: "Screening", count: 68, color: "#6366F1" },
  { label: "Interview", count: 34, color: "#F59E0B" },
  { label: "Offer", count: 12, color: "#10B981" },
  { label: "Hired", count: 8, color: "#06B6D4" },
];

const recentCandidates = [
  { name: "Priya Sharma", role: "UI/UX Designer", status: "Interview", statusColor: "#F59E0B" },
  { name: "Rohan Mehta", role: "React Developer", status: "Shortlisted", statusColor: "#6366F1" },
  { name: "Anita Verma", role: "Project Manager", status: "Offer Sent", statusColor: "#10B981" },
  { name: "Karan Singh", role: "Data Analyst", status: "Applied", statusColor: "#8B5CF6" },
  { name: "Sneha Patel", role: "DevOps Engineer", status: "Rejected", statusColor: "#EF4444" },
];

const topClients = [
  { name: "Acme Corp", revenue: "₹8.4L", deals: 12, growth: 18, color: "#6366F1" },
  { name: "TechStart Ltd", revenue: "₹6.1L", deals: 9, growth: 12, color: "#10B981" },
  { name: "Globex Inc", revenue: "₹5.8L", deals: 7, growth: -4, color: "#EF4444" },
  { name: "Nexus Co", revenue: "₹4.2L", deals: 6, growth: 22, color: "#8B5CF6" },
  { name: "BrightWave", revenue: "₹3.9L", deals: 5, growth: 8, color: "#06B6D4" },
];

const totalPipeline = jobPipeline.reduce((s, j) => s + j.count, 0);
const maxRev = Math.max(...revenueData.map(d => d.revenue));
const maxSales = Math.max(...monthlySales.map(d => d.value));
const maxProfit = Math.max(...profitTrend);

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: color + "18", color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function CardHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{title}</h2>
        {sub && <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// Smooth SVG line chart
function LineChart({ data, color, height = 80 }: { data: number[]; color: string; height?: number }) {
  const w = 300; const h = height;
  const pad = 4;
  const max = Math.max(...data); const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace("#","")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => i === pts.length - 1 && (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// Mini sparkline
function Sparkline({ data, color }: { data: number[]; color: string }) {
  return <LineChart data={data} color={color} height={40} />;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [revenueMode, setRevenueMode] = useState<"revenue" | "expenses" | "profit">("revenue");

  const activeRevenueData = revenueData.map(d => d[revenueMode]);
  const maxActive = Math.max(...activeRevenueData);

  const riskColor = (r: string) => r === "High" ? "#EF4444" : r === "Medium" ? "#F59E0B" : "#10B981";

  return (
    <div className="space-y-6 pb-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>
            Good morning, Arjun 👋
          </h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            Here's your full operations snapshot for June 2026.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(99,102,241,0.10)", color: "#6366F1" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            June 2026
          </span>
          <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-card-bg)", color: "var(--bz-text-2)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export
          </button>
        </div>
      </div>

      {/* ── Row 1: Top 5 KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {topStats.map((s) => (
          <div key={s.label} className="rounded-xl border p-4 transition-all duration-200 hover:shadow-md cursor-default" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-start justify-between mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ backgroundColor: s.up ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)", color: s.up ? "#10B981" : "#EF4444" }}>
                {s.up ? "↑" : "↓"} {s.change}
              </span>
            </div>
            <p className="text-[22px] font-extrabold tracking-tight leading-none" style={{ color: "var(--bz-text-1)" }}>{s.value}</p>
            <p className="text-[11.5px] font-semibold mt-1" style={{ color: "var(--bz-text-2)" }}>{s.label}</p>
            <p className="text-[10.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 2: Bottom 6 KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {bottomStats.map((s) => (
          <div key={s.label} className="rounded-xl border p-4 transition-all duration-200 hover:shadow-md cursor-default relative overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: s.warning ? s.color + "55" : "var(--bz-border-hard)" }}>
            {s.warning && (
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ backgroundColor: s.color }} />
            )}
            <div className="flex items-start justify-between mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: s.bg, color: s.color }}>{s.icon}</span>
              {s.warning ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.color + "18", color: s.color }}>
                  ⚠ {s.change}
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ backgroundColor: s.up ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)", color: s.up ? "#10B981" : "#EF4444" }}>
                  {s.up ? "↑" : "↓"} {s.change}
                </span>
              )}
            </div>
            <p className="text-[20px] font-extrabold tracking-tight leading-none" style={{ color: "var(--bz-text-1)" }}>{s.value}</p>
            <p className="text-[11px] font-semibold mt-1" style={{ color: "var(--bz-text-2)" }}>{s.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 3: Revenue Overview + Job Pipeline ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue Overview */}
        <div className="xl:col-span-2 rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>Revenue Overview</h2>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Monthly figures in lakhs (₹)</p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["revenue", "expenses", "profit"] as const).map(m => (
                <button key={m} onClick={() => setRevenueMode(m)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-all"
                  style={{
                    backgroundColor: revenueMode === m ? (m === "revenue" ? "#6366F1" : m === "expenses" ? "#EF4444" : "#10B981") : "var(--bz-bg)",
                    color: revenueMode === m ? "#fff" : "var(--bz-text-3)",
                    border: "1px solid var(--bz-border-hard)",
                  }}
                >{m}</button>
              ))}
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-stretch gap-1.5 h-44">
            {revenueData.map((d, i) => {
              const val = d[revenueMode];
              const barColor = revenueMode === "revenue" ? "#6366F1" : revenueMode === "expenses" ? "#EF4444" : "#10B981";
              const isLast = i === revenueData.length - 1;
              const barHeightPct = (val / maxActive) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center group relative">
                  {/* spacer pushes bar to the bottom */}
                  <div className="flex-1" />
                  {/* tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
                    style={{ bottom: "calc(18px + " + barHeightPct + "% )" }}>
                    <div className="rounded-md px-2 py-1 text-[10px] font-bold text-white whitespace-nowrap shadow-lg" style={{ backgroundColor: barColor }}>
                      ₹{val}L
                    </div>
                  </div>
                  {/* bar */}
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${barHeightPct}%`,
                      minHeight: "4px",
                      background: isLast
                        ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                        : barColor + (isLast ? "" : "60"),
                    }}
                  />
                  <span className="text-[9.5px] mt-1 shrink-0" style={{ color: "var(--bz-text-3)" }}>{d.month}</span>
                </div>
              );
            })}
          </div>
          {/* Summary row */}
          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4" style={{ borderColor: "var(--bz-border-hard)" }}>
            {[
              { label: "Total Revenue", value: "₹72.3L", color: "#6366F1" },
              { label: "Total Expenses", value: "₹34.1L", color: "#EF4444" },
              { label: "Net Profit", value: "₹38.2L", color: "#10B981" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[16px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Pipeline */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <CardHeader title="Job Pipeline" sub={`${totalPipeline} total applicants`} action={<a href="/dashboard/jobs" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>} />
          <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
            {jobPipeline.map(j => (
              <div key={j.label} title={`${j.label}: ${j.count}`} style={{ width: `${(j.count / totalPipeline) * 100}%`, backgroundColor: j.color }} />
            ))}
          </div>
          <div className="space-y-2.5 mb-4">
            {jobPipeline.map(j => (
              <div key={j.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: j.color }} />
                  <span className="text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>{j.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full" style={{ width: `${(j.count / totalPipeline) * 80}px`, backgroundColor: j.color + "40" }}>
                    <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: j.color }} />
                  </div>
                  <span className="text-[12px] font-semibold w-6 text-right" style={{ color: "var(--bz-text-1)" }}>{j.count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>Conversion rate</span>
              <span className="text-[13px] font-bold" style={{ color: "#10B981" }}>6.5%</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: "var(--bz-border-hard)" }}>
              <div className="h-full rounded-full" style={{ width: "6.5%", backgroundColor: "#10B981" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Monthly Sales + Profit Trend + Donut ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Monthly Sales Line Chart */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <CardHeader
            title="Monthly Sales"
            sub="Revenue trend (₹ in lakhs)"
            action={
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(6,182,212,0.10)", color: "#06B6D4" }}>+31% YoY</span>
                <a href="/dashboard/sales" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>
              </div>
            }
          />
          <LineChart data={monthlySales.map(d => d.value)} color="#06B6D4" height={100} />
          <div className="mt-3 flex items-end justify-between">
            {monthlySales.filter((_, i) => i % 2 === 0).map(d => (
              <span key={d.month} className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>{d.month}</span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div>
              <p className="text-[18px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>₹84L</p>
              <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>Best month (Dec)</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>₹55L</p>
              <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>Monthly average</p>
            </div>
          </div>
        </div>

        {/* Profit Trend */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <CardHeader
            title="Profit Trends"
            sub="Net profit monthly (₹ in lakhs)"
            action={
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(139,92,246,0.10)", color: "#8B5CF6" }}>↑ 18.4%</span>
                <a href="/dashboard/finance" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>
              </div>
            }
          />
          <LineChart data={profitTrend} color="#8B5CF6" height={100} />
          <div className="mt-3 flex items-end justify-between">
            {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map(m => (
              <span key={m} className="text-[9.5px]" style={{ color: "var(--bz-text-3)" }}>{m}</span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2" style={{ borderColor: "var(--bz-border-hard)" }}>
            {[
              { label: "Q1", val: "₹69L", up: true },
              { label: "Q2", val: "₹84L", up: true },
              { label: "Q3", val: "₹1.05Cr", up: true },
            ].map(q => (
              <div key={q.label} className="text-center p-2 rounded-lg" style={{ backgroundColor: "rgba(139,92,246,0.06)" }}>
                <p className="text-[12px] font-bold" style={{ color: "#8B5CF6" }}>{q.val}</p>
                <p className="text-[10px]" style={{ color: "var(--bz-text-3)" }}>{q.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Split Donut */}
        <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <CardHeader title="Revenue Split" sub="By business segment" action={<a href="/dashboard/finance" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>} />
          {/* SVG Donut */}
          <div className="flex items-center justify-center my-2">
            <svg viewBox="0 0 120 120" width="140" height="140">
              {[
                { pct: 0.38, color: "#6366F1", label: "Staffing" },
                { pct: 0.27, color: "#10B981", label: "Consulting" },
                { pct: 0.20, color: "#F59E0B", label: "Permits" },
                { pct: 0.15, color: "#06B6D4", label: "Insurance" },
              ].reduce<{ els: React.ReactNode[]; offset: number }>((acc, seg) => {
                const r = 48; const cx = 60; const cy = 60;
                const circ = 2 * Math.PI * r;
                const dash = seg.pct * circ;
                const gap = circ - dash;
                const rotate = acc.offset * 360 - 90;
                acc.els.push(
                  <circle key={seg.label} cx={cx} cy={cy} r={r}
                    fill="none" stroke={seg.color} strokeWidth="18"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset="0"
                    transform={`rotate(${rotate} ${cx} ${cy})`}
                  />
                );
                acc.offset += seg.pct;
                return acc;
              }, { els: [], offset: 0 }).els}
              <circle cx="60" cy="60" r="30" fill="var(--bz-card-bg)" />
              <text x="60" y="57" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--bz-text-1)">₹72.3L</text>
              <text x="60" y="69" textAnchor="middle" fontSize="7" fill="var(--bz-text-3)">Total</text>
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[
              { label: "Staffing", pct: "38%", color: "#6366F1" },
              { label: "Consulting", pct: "27%", color: "#10B981" },
              { label: "Permits", pct: "20%", color: "#F59E0B" },
              { label: "Insurance", pct: "15%", color: "#06B6D4" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[11.5px]" style={{ color: "var(--bz-text-2)" }}>{s.label}</span>
                <span className="ml-auto text-[11px] font-bold" style={{ color: s.color }}>{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Recent Payments + Overdue Accounts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Recent Payments */}
        <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div>
              <h2 className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Recent Payments</h2>
              <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Latest received transactions</p>
            </div>
            <a href="/dashboard/invoices" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--bz-border-hard)" }}>
            {recentPayments.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[rgba(99,102,241,0.03)] transition-colors">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold" style={{ backgroundColor: p.color + "18", color: p.color }}>PAY</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{p.id}</p>
                  <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{p.client} · {p.method}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold" style={{ color: "#10B981" }}>{p.amount}</p>
                  <p className="text-[10.5px]" style={{ color: "var(--bz-text-3)" }}>{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Accounts */}
        <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <div>
              <h2 className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Overdue Accounts</h2>
              <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Requires immediate follow-up</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.10)", color: "#EF4444" }}>₹4.12L overdue</span>
              <a href="/dashboard/finance" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--bz-border-hard)" }}>
            {overdueAccounts.map(acc => (
              <div key={acc.client} className="flex items-center gap-3 px-5 py-3 hover:bg-[rgba(239,68,68,0.02)] transition-colors">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ backgroundColor: riskColor(acc.risk) + "18", color: riskColor(acc.risk) }}>
                  {acc.client.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{acc.client}</p>
                  <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Due {acc.dueDate} · {acc.days} days overdue</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold" style={{ color: "#EF4444" }}>{acc.amount}</p>
                  <StatusBadge label={acc.risk + " Risk"} color={riskColor(acc.risk)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 6: Recent Candidates + Top Clients ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Recent Candidates */}
        <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <h2 className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Recent Candidates</h2>
            <a href="/dashboard/candidates" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--bz-border-hard)" }}>
            {recentCandidates.map(c => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 hover:bg-[rgba(99,102,241,0.03)] transition-colors">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "var(--bz-gradient)" }}>
                  {c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{c.name}</p>
                  <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{c.role}</p>
                </div>
                <StatusBadge label={c.status} color={c.statusColor} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
            <h2 className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Top Clients by Revenue</h2>
            <a href="/dashboard/clients" className="text-[11.5px] font-semibold" style={{ color: "#6366F1" }}>View all →</a>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--bz-border-hard)" }}>
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 hover:bg-[rgba(99,102,241,0.03)] transition-colors">
                <span className="text-[12px] font-extrabold w-5 shrink-0" style={{ color: i < 3 ? c.color : "var(--bz-text-3)" }}>#{i + 1}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ backgroundColor: c.color + "18", color: c.color }}>
                  {c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{c.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{c.deals} deals</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{c.revenue}</p>
                  <span className="text-[10.5px] font-semibold" style={{ color: c.growth >= 0 ? "#10B981" : "#EF4444" }}>
                    {c.growth >= 0 ? "↑" : "↓"} {Math.abs(c.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 7: Sparkline Mini KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Deal Size", value: "₹3.2L", change: "+7%", color: "#6366F1", data: [20, 24, 22, 28, 26, 30, 29, 34, 31, 36, 34, 38] },
          { label: "Collection Rate", value: "87.4%", change: "+2.1%", color: "#10B981", data: [80, 82, 79, 84, 83, 86, 85, 87, 86, 88, 87, 88] },
          { label: "Candidate Fill Rate", value: "74%", change: "+5%", color: "#8B5CF6", data: [60, 65, 62, 68, 66, 71, 69, 73, 71, 74, 72, 74] },
          { label: "Client Retention", value: "92%", change: "+1.5%", color: "#F59E0B", data: [88, 89, 88, 90, 89, 91, 90, 92, 91, 92, 91, 92] },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11.5px] font-semibold" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.10)", color: "#10B981" }}>↑ {s.change}</span>
            </div>
            <p className="text-[20px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>{s.value}</p>
            <div className="mt-2">
              <Sparkline data={s.data} color={s.color} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}