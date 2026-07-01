"use client";
import { useState } from "react";

type PlanKey = "starter" | "pro" | "business" | "enterprise";
type Billing = "monthly" | "annual";

const PLANS: { key: PlanKey; name: string; icon: string; color: string; monthlyPrice: number; annualPrice: number; description: string; features: string[]; limit: string }[] = [
  {
    key: "starter", name: "Starter", icon: "🌱", color: "#10B981",
    monthlyPrice: 0, annualPrice: 0,
    description: "Perfect for solo recruiters just getting started.",
    limit: "1 user · 50 candidates · 5 clients",
    features: ["1 recruiter seat", "Up to 50 candidates", "5 active clients", "Basic job orders", "Invoice generation", "Email support"],
  },
  {
    key: "pro", name: "Pro", icon: "⚡", color: "#6366F1",
    monthlyPrice: 499, annualPrice: 399,
    description: "Best for growing recruitment teams.",
    limit: "Up to 10 users · Unlimited candidates",
    features: ["Up to 10 recruiter seats", "Unlimited candidates", "Unlimited clients", "Advanced job tracking", "Quotations & proposals", "Finance dashboard", "Sales & performance reports", "Priority email support", "Custom branding"],
  },
  {
    key: "business", name: "Business", icon: "🚀", color: "#8B5CF6",
    monthlyPrice: 999, annualPrice: 799,
    description: "For established agencies scaling operations.",
    limit: "Up to 30 users · Multi-branch",
    features: ["Up to 30 recruiter seats", "Everything in Pro", "Multi-branch management", "Advanced analytics", "API access (5k req/day)", "Zapier & Slack integration", "Custom reports", "Dedicated account manager", "SLA support (24h response)"],
  },
  {
    key: "enterprise", name: "Enterprise", icon: "🏢", color: "#F59E0B",
    monthlyPrice: 0, annualPrice: 0,
    description: "Custom pricing for large-scale agencies.",
    limit: "Unlimited users · Custom SLA",
    features: ["Unlimited seats", "Everything in Business", "Custom integrations", "White-label options", "Onboarding & training", "Dedicated success team", "Custom SLA (<4h response)", "SAML SSO", "Data residency options"],
  },
];

const HISTORY = [
  { date: "Jun 1, 2026",  period: "Jun 2026",  amount: 499,  status: "paid",    inv: "INV-B-0006" },
  { date: "May 1, 2026",  period: "May 2026",  amount: 499,  status: "paid",    inv: "INV-B-0005" },
  { date: "Apr 1, 2026",  period: "Apr 2026",  amount: 499,  status: "paid",    inv: "INV-B-0004" },
  { date: "Mar 1, 2026",  period: "Mar 2026",  amount: 499,  status: "paid",    inv: "INV-B-0003" },
  { date: "Feb 1, 2026",  period: "Feb 2026",  amount: 499,  status: "paid",    inv: "INV-B-0002" },
  { date: "Jan 1, 2026",  period: "Jan 2026",  amount: 499,  status: "paid",    inv: "INV-B-0001" },
];

export default function BillingPage() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [currentPlan, setCurrentPlan] = useState<PlanKey>("pro");
  const [confirmPlan, setConfirmPlan] = useState<PlanKey | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const active = PLANS.find(p => p.key === currentPlan)!;

  function confirmCancellation() {
    setCurrentPlan("starter");
    setShowCancelModal(false);
  }

  function getPrice(p: typeof PLANS[0]) {
    if (p.monthlyPrice === 0) return null;
    return billing === "annual" ? p.annualPrice : p.monthlyPrice;
  }

  function handleUpgrade(key: PlanKey) {
    if (key === "enterprise") return;
    if (key === currentPlan) return;
    setConfirmPlan(key);
  }

  function confirmUpgrade() {
    if (confirmPlan) setCurrentPlan(confirmPlan);
    setConfirmPlan(null);
  }

  const planOrder: PlanKey[] = ["starter", "pro", "business", "enterprise"];
  function isUpgrade(key: PlanKey) { return planOrder.indexOf(key) > planOrder.indexOf(currentPlan); }
  function isDowngrade(key: PlanKey) { return planOrder.indexOf(key) < planOrder.indexOf(currentPlan); }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>Billing & Subscription</h1>
        <p className="text-[12.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Manage your plan, payment method and invoices</p>
      </div>

      {/* Active Plan Banner */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ background: `linear-gradient(135deg,${active.color}14,${active.color}06)`, borderBottom: `1px solid ${active.color}30` }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{active.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[16px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{active.name} Plan</p>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: active.color, color: "#fff" }}>Active</span>
              </div>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>
                {active.monthlyPrice === 0 ? "Free forever" : `AED ${billing === "annual" ? active.annualPrice : active.monthlyPrice}/mo · billed ${billing === "annual" ? "annually" : "monthly"}`}
                {billing === "annual" && active.annualPrice > 0 && (
                  <span className="ml-2 font-bold" style={{ color: "#10B981" }}>
                    Saving AED {(active.monthlyPrice - active.annualPrice) * 12}/yr
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {currentPlan !== "starter" && (
              <>
                <div className="text-right">
                  <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Next billing date</p>
                  <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>Jul 1, 2026</p>
                </div>
                <button onClick={() => setShowCancelModal(true)} className="px-4 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>
                  Cancel Plan
                </button>
              </>
            )}
            {currentPlan === "starter" && (
              <div className="text-right">
                <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Plan status</p>
                <p className="text-[13px] font-bold" style={{ color: "#10B981" }}>Free Tier</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage meters */}
        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Recruiter Seats", used: 4, total: 10, color: active.color },
            { label: "Active Clients",  used: 12, total: 999, color: "#10B981" },
            { label: "Candidates",      used: 186, total: 999, color: "#8B5CF6" },
            { label: "API Calls (day)", used: 0, total: 0, color: "#F59E0B" },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--bz-text-3)" }}>
                <span>{m.label}</span>
                <span className="font-bold" style={{ color: m.color }}>{m.total === 0 ? "—" : m.total === 999 ? `${m.used} / ∞` : `${m.used}/${m.total}`}</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                {m.total > 0 && m.total !== 999 && (
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.round(m.used / m.total * 100))}%`, backgroundColor: m.color }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Selection */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>Choose a Plan</p>
          {/* Billing toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl border self-start" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
            <button onClick={() => setBilling("monthly")} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
              style={{ backgroundColor: billing === "monthly" ? "#6366F1" : "transparent", color: billing === "monthly" ? "#fff" : "var(--bz-text-3)" }}>Monthly</button>
            <button onClick={() => setBilling("annual")} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5"
              style={{ backgroundColor: billing === "annual" ? "#6366F1" : "transparent", color: billing === "annual" ? "#fff" : "var(--bz-text-3)" }}>
              Annual
              <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#10B98122", color: "#10B981" }}>-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PLANS.map(plan => {
            const price = getPrice(plan);
            const isCurrent = plan.key === currentPlan;
            const upgrade = isUpgrade(plan.key);
            const downgrade = isDowngrade(plan.key);

            return (
              <div key={plan.key} className="rounded-2xl border flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
                style={{
                  backgroundColor: "var(--bz-card-bg)",
                  borderColor: isCurrent ? plan.color : "var(--bz-border-hard)",
                  boxShadow: isCurrent ? `0 0 15px -3px ${plan.color}25` : "none",
                }}>

                {/* Card top bar accent */}
                <div className="h-1.5 w-full" style={{ backgroundColor: plan.color }} />

                <div className="p-5 flex-1 flex flex-col">
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: `${plan.color}12`, color: plan.color }}>
                      {plan.icon}
                    </div>
                    <div>
                      <p className="text-[14.5px] font-extrabold leading-none" style={{ color: "var(--bz-text-1)" }}>{plan.name}</p>
                      <span className="text-[10px] font-semibold mt-1 block" style={{ color: "var(--bz-text-3)" }}>Subscription Plan</span>
                    </div>
                    {isCurrent && (
                      <span className="ml-auto text-[9.5px] font-extrabold px-2 py-0.5 rounded-full text-white shadow-sm" style={{ backgroundColor: plan.color }}>Active</span>
                    )}
                    {plan.key === "pro" && !isCurrent && (
                      <span className="ml-auto text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shadow-sm" style={{ backgroundColor: "#6366F122", color: "#6366F1" }}>Popular</span>
                    )}
                  </div>

                  <p className="text-[11.5px] mb-4 min-h-[34px]" style={{ color: "var(--bz-text-3)" }}>{plan.description}</p>

                  {/* Price */}
                  <div className="mb-4 bg-black/10 rounded-xl p-3 border" style={{ borderColor: "var(--bz-border-hard)" }}>
                    {price === null ? (
                      <p className="text-[16px] font-extrabold" style={{ color: plan.color }}>Custom Price</p>
                    ) : price === 0 ? (
                      <p className="text-[26px] font-extrabold tracking-tight" style={{ color: plan.color }}>Free <span className="text-[11.5px] font-medium" style={{ color: "var(--bz-text-3)" }}>forever</span></p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11.5px] font-bold text-gray-400">AED</span>
                        <span className="text-[26px] font-extrabold leading-none tracking-tight" style={{ color: plan.color }}>{price}</span>
                        <span className="text-[11.5px] font-medium" style={{ color: "var(--bz-text-3)" }}>/mo</span>
                      </div>
                    )}
                    {billing === "annual" && price !== null && price > 0 && (
                      <p className="text-[9.5px] mt-1" style={{ color: "var(--bz-text-3)" }}>Billed annually (AED {price * 12}/yr)</p>
                    )}
                  </div>

                  {/* Capacity Limit Tag */}
                  <div className="text-[10.5px] font-bold px-3 py-1.5 rounded-lg mb-4 flex items-center justify-between border border-dashed" 
                    style={{ backgroundColor: `${plan.color}08`, borderColor: `${plan.color}25`, color: plan.color }}>
                    <span>User Capacity</span>
                    <span>{plan.limit.split(" · ")[0]}</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-[12px] leading-tight" style={{ color: "var(--bz-text-2)" }}>
                        <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action CTA */}
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl text-[12.5px] font-extrabold text-center border" style={{ borderColor: plan.color, color: plan.color, backgroundColor: `${plan.color}05` }}>
                      ✓ Your Current Plan
                    </div>
                  ) : plan.key === "enterprise" ? (
                    <button className="w-full py-2.5 rounded-xl text-[12.5px] font-extrabold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]" style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
                      Contact Sales
                    </button>
                  ) : (
                    <button onClick={() => handleUpgrade(plan.key)}
                      className="w-full py-2.5 rounded-xl text-[12.5px] font-extrabold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98]"
                      style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
                      {upgrade ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
          <p className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Payment Method</p>
          <button onClick={() => setShowPaymentForm(v => !v)} className="text-[12.5px] font-semibold" style={{ color: "#6366F1" }}>
            {showPaymentForm ? "Cancel" : "+ Add / Update Card"}
          </button>
        </div>
        <div className="p-5">
          {!showPaymentForm && (
            <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
              <div className="flex h-10 w-16 items-center justify-center rounded-lg font-extrabold text-white text-[13px]" style={{ background: "linear-gradient(135deg,#1a1f71,#0070cc)" }}>VISA</div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>Visa ending in •••• 4242</p>
                <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>Expires 08/2028 · Arjun Kumar</p>
              </div>
              <span className="ml-auto text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>Default</span>
            </div>
          )}
          {showPaymentForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Cardholder Name", placeholder: "Arjun Kumar", type: "text", span: false },
                { label: "Card Number", placeholder: "1234 5678 9012 3456", type: "text", span: false },
                { label: "Expiry Date", placeholder: "MM/YY", type: "text", span: false },
                { label: "CVV", placeholder: "•••", type: "password", span: false },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-[10.5px] font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full h-9 rounded-lg px-3 text-[13px] outline-none border focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
                    style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }} />
                </div>
              ))}
              <div className="sm:col-span-2 flex justify-end gap-2">
                <button onClick={() => setShowPaymentForm(false)} className="px-4 py-2 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Cancel</button>
                <button onClick={() => setShowPaymentForm(false)} className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>Save Card</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
          <p className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>Billing History</p>
        </div>
        <div className="hidden sm:grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 px-5 py-2.5 border-b text-[10.5px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-3)" }}>
          <span>Invoice</span><span>Period</span><span>Amount</span><span>Status</span><span className="text-right">Download</span>
        </div>
        {HISTORY.map(h => (
          <div key={h.inv} className="border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
            {/* Mobile */}
            <div className="sm:hidden px-4 py-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{h.inv}</p>
                <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{h.date} · {h.period}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>AED {h.amount}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>Paid</span>
              </div>
            </div>
            {/* Desktop */}
            <div className="hidden sm:grid grid-cols-[1fr_120px_100px_100px_100px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(99,102,241,0.02)]">
              <div>
                <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{h.inv}</p>
                <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{h.date}</p>
              </div>
              <span className="text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>{h.period}</span>
              <span className="text-[13px] font-bold" style={{ color: "#6366F1" }}>AED {h.amount}</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />Paid
              </span>
              <button className="text-right text-[12px] font-semibold" style={{ color: "#6366F1" }}>↓ PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmPlan && (() => {
        const next = PLANS.find(p => p.key === confirmPlan)!;
        const price = getPrice(next);
        const upgrade = isUpgrade(confirmPlan);
        return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-2xl" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <span className="text-3xl">{next.icon}</span>
              <h3 className="text-[16px] font-extrabold mt-2" style={{ color: "var(--bz-text-1)" }}>
                {upgrade ? "Upgrade" : "Downgrade"} to {next.name}?
              </h3>
              <p className="text-[12.5px] mt-1 mb-4" style={{ color: "var(--bz-text-3)" }}>
                You are switching from <strong>{active.name}</strong> to <strong>{next.name}</strong>.
                {price !== null && price > 0 && ` New price: AED ${price}/mo.`}
                {price === 0 && " This plan is free."}
              </p>
              {!upgrade && (
                <div className="rounded-lg p-3 mb-4 border text-[12px]" style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "#EF4444" }}>
                  ⚠️ Downgrading may reduce your seats and feature access. Changes take effect at next billing cycle.
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setConfirmPlan(null)} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Cancel</button>
                <button onClick={confirmUpgrade} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold text-white" style={{ background: `linear-gradient(135deg,${next.color},${next.color}bb)` }}>
                  Confirm {upgrade ? "Upgrade" : "Downgrade"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl border p-6 shadow-2xl" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <span className="text-3xl">⚠️</span>
            <h3 className="text-[16px] font-extrabold mt-2" style={{ color: "var(--bz-text-1)" }}>
              Cancel your {active.name} Subscription?
            </h3>
            <p className="text-[12.5px] mt-1.5 mb-4" style={{ color: "var(--bz-text-3)" }}>
              You will lose access to premium features, advanced analytics, custom branding, and recruiter seats at the end of your billing cycle on <strong>Jul 1, 2026</strong>.
            </p>
            <div className="rounded-lg p-3 mb-4 border text-[12px]" style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "#EF4444" }}>
              Note: Downgrading to the Starter plan limits you to 1 active seat and 5 clients. Your data won't be deleted.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Keep Plan</button>
              <button onClick={confirmCancellation} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
