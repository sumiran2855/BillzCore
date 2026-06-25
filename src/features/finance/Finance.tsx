"use client";

import { useState, useMemo } from "react";
import {
  mockTransactions, mockMonthlyData, mockExpenseCategories, mockReceivables,
  TX_TYPE_CONFIG, TX_STATUS_CONFIG, TransactionType, TransactionStatus,
} from "./financeTypes";

function StatCard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}18`, color }}>{sub}</span>
      </div>
      <p className="text-[20px] sm:text-[22px] font-extrabold" style={{ color }}>{value}</p>
      <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{label}</p>
    </div>
  );
}

const TABS = ["overview", "transactions", "receivables"] as const;
type Tab = typeof TABS[number];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [txType, setTxType] = useState<"all" | TransactionType>("all");
  const [search, setSearch] = useState("");

  const maxRevenue = Math.max(...mockMonthlyData.map(d => d.revenue));

  const filteredTx = useMemo(() => {
    const q = search.toLowerCase();
    return mockTransactions.filter(tx => {
      const matchType = txType === "all" || tx.type === txType;
      const matchSearch = !q || `${tx.description} ${tx.category} ${tx.clientName || ""} ${tx.reference}`.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [txType, search]);

  const totalIncome   = mockTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const pendingTx     = mockTransactions.filter(t => t.status === "pending").length;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Finance</h1>
          <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
            Revenue, expenses and cash flow overview
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border shrink-0"
          style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-card-bg)", color: "var(--bz-text-2)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Revenue (Jun)" value={`AED ${(495000).toLocaleString()}`}   sub="Jun 2026"   color="#10B981" icon="💰" />
        <StatCard label="Total Expenses (Jun)" value={`AED ${(185000).toLocaleString()}`}  sub="Jun 2026"   color="#EF4444" icon="📤" />
        <StatCard label="Net Profit (Jun)"     value={`AED ${(310000).toLocaleString()}`}  sub="+18.8% MoM" color="#6366F1" icon="📈" />
        <StatCard label="Pending Transactions" value={String(pendingTx)}                   sub="Need review" color="#F59E0B" icon="⏳" />
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b overflow-x-auto" style={{ borderColor: "var(--bz-border-hard)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-3 text-[12.5px] font-semibold capitalize border-b-2 transition-all shrink-0"
            style={{ borderBottomColor: activeTab === tab ? "#6366F1" : "transparent", color: activeTab === tab ? "#6366F1" : "var(--bz-text-3)" }}>
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Revenue vs Expenses Chart */}
            <div className="xl:col-span-2 rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Revenue vs Expenses</p>
                <div className="flex items-center gap-3 text-[11px]">
                  {[{ l: "Revenue", c: "#6366F1" }, { l: "Expenses", c: "#EF4444" }, { l: "Profit", c: "#10B981" }].map(i => (
                    <span key={i.l} className="flex items-center gap-1" style={{ color: "var(--bz-text-3)" }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2 sm:gap-3 h-44">
                {mockMonthlyData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5" style={{ height: "140px" }}>
                      {[
                        { val: d.revenue,  color: "#6366F1" },
                        { val: d.expenses, color: "#EF4444" },
                        { val: d.profit,   color: "#10B981" },
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 rounded-t-md transition-all duration-500" style={{
                          height: `${Math.round((bar.val / maxRevenue) * 100)}%`,
                          background: `linear-gradient(to top, ${bar.color}dd, ${bar.color}88)`,
                          minHeight: "4px",
                        }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: "var(--bz-text-3)" }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[13px] font-bold mb-4" style={{ color: "var(--bz-text-1)" }}>Expense Breakdown</p>
              <div className="space-y-3">
                {mockExpenseCategories.map(cat => (
                  <div key={cat.label}>
                    <div className="flex justify-between text-[11.5px] mb-1">
                      <span className="font-semibold" style={{ color: "var(--bz-text-2)" }}>{cat.label}</span>
                      <span style={{ color: "var(--bz-text-3)" }}>AED {cat.amount.toLocaleString()} · {cat.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                      <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly summary table */}
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
              <p className="text-[12px] font-bold" style={{ color: "var(--bz-text-1)" }}>Monthly P&L Summary (AED)</p>
            </div>
            <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
              style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>
              <span>Month</span><span className="text-right">Revenue</span><span className="text-right">Expenses</span><span className="text-right">Net Profit</span>
            </div>
            {mockMonthlyData.map(d => (
              <div key={d.month} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                {/* Mobile */}
                <div className="sm:hidden px-4 py-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>{d.month} 2026</span>
                    <span className="text-[13px] font-extrabold" style={{ color: "#10B981" }}>+{d.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4 text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>
                    <span>Rev: {d.revenue.toLocaleString()}</span>
                    <span>Exp: {d.expenses.toLocaleString()}</span>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-3 items-center">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{d.month} 2026</span>
                  <span className="text-[13px] text-right" style={{ color: "#6366F1" }}>{d.revenue.toLocaleString()}</span>
                  <span className="text-[13px] text-right" style={{ color: "#EF4444" }}>{d.expenses.toLocaleString()}</span>
                  <span className="text-[13px] font-bold text-right" style={{ color: "#10B981" }}>+{d.profit.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bz-text-3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full h-9 rounded-lg pl-8 pr-3 text-[12.5px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
                style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
            </div>
            {/* Type filter */}
            {(["all", "income", "expense", "refund", "transfer"] as const).map(t => (
              <button key={t} onClick={() => setTxType(t)}
                className="px-3 py-1 rounded-full text-[11.5px] font-semibold transition-all shrink-0"
                style={{
                  backgroundColor: txType === t ? (t === "all" ? "#6366F1" : TX_TYPE_CONFIG[t as TransactionType]?.color || "#6366F1") : "var(--bz-bg)",
                  color: txType === t ? "#fff" : "var(--bz-text-3)",
                  border: "1px solid var(--bz-border-hard)",
                }}>
                {t === "all" ? "All" : TX_TYPE_CONFIG[t as TransactionType].label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="hidden sm:grid grid-cols-[110px_1fr_120px_110px_110px_90px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
              style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
              <span>Date</span><span>Description</span><span>Category</span><span>Reference</span><span>Amount</span><span>Status</span>
            </div>

            {filteredTx.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl">💳</span>
                <p className="mt-3 text-[13px]" style={{ color: "var(--bz-text-3)" }}>No transactions found</p>
              </div>
            )}

            {filteredTx.map(tx => {
              const tc = TX_TYPE_CONFIG[tx.type];
              const sc = TX_STATUS_CONFIG[tx.status];
              return (
                <div key={tx.id} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                  {/* Mobile */}
                  <div className="sm:hidden px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold truncate" style={{ color: "var(--bz-text-1)" }}>{tx.description}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{tx.date} · {tx.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-extrabold" style={{ color: tc.color }}>{tc.sign}{tx.currency} {tx.amount.toLocaleString()}</p>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold mt-0.5" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                      </div>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-[110px_1fr_120px_110px_110px_90px] gap-4 px-5 py-3 items-center hover:bg-[rgba(99,102,241,0.02)]">
                    <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{tx.date}</span>
                    <div>
                      <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{tx.description}</p>
                      {tx.clientName && <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{tx.clientName}</p>}
                    </div>
                    <span className="text-[11.5px] px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: tc.bg, color: tc.color }}>{tx.category}</span>
                    <span className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{tx.reference}</span>
                    <span className="text-[13px] font-bold" style={{ color: tc.color }}>{tc.sign}{tx.currency} {tx.amount.toLocaleString()}</span>
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
      )}

      {/* RECEIVABLES */}
      {activeTab === "receivables" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Outstanding", value: "AED 321,600+", color: "#6366F1", icon: "📋" },
              { label: "Overdue Amount",    value: "2 Clients",     color: "#EF4444", icon: "⚠️" },
              { label: "Due This Month",    value: "AED 88,500+",  color: "#F59E0B", icon: "📅" },
            ].map(c => (
              <div key={c.label} className="rounded-xl border p-4 flex items-center gap-4" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-[16px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
                  <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="hidden sm:grid grid-cols-[1fr_130px_110px_110px_90px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
              style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-3)" }}>
              <span>Client</span><span>Amount</span><span>Due Date</span><span>Overdue</span><span>Status</span>
            </div>
            {mockReceivables.map((r, i) => (
              <div key={i} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                {/* Mobile */}
                <div className="sm:hidden px-4 py-3">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{r.client}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Due: {r.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-extrabold" style={{ color: r.status === "overdue" ? "#EF4444" : "#6366F1" }}>
                        {r.currency} {r.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{
                        backgroundColor: r.status === "overdue" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                        color: r.status === "overdue" ? "#EF4444" : "#10B981",
                      }}>
                        {r.status === "overdue" ? `${r.overdueDays}d overdue` : "Current"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[1fr_130px_110px_110px_90px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{r.client}</span>
                  <span className="text-[13px] font-bold" style={{ color: r.status === "overdue" ? "#EF4444" : "#6366F1" }}>
                    {r.currency} {r.amount.toLocaleString()}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--bz-text-2)" }}>{r.dueDate}</span>
                  <span className="text-[12px]" style={{ color: r.overdueDays > 0 ? "#EF4444" : "var(--bz-text-3)" }}>
                    {r.overdueDays > 0 ? `${r.overdueDays} days` : "—"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold w-fit"
                    style={{ backgroundColor: r.status === "overdue" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: r.status === "overdue" ? "#EF4444" : "#10B981" }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.status === "overdue" ? "#EF4444" : "#10B981" }} />
                    {r.status === "overdue" ? "Overdue" : "Current"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
