"use client";

import { useState } from "react";

type Section = "general" | "team" | "notifications" | "billing" | "integrations" | "security";

const NAV: { key: Section; label: string; icon: string; desc: string }[] = [
  { key: "general",       label: "General",       icon: "⚙️",  desc: "Company info & branding"    },
  { key: "team",          label: "Team & Users",  icon: "👥",  desc: "Manage team members"        },
  { key: "notifications", label: "Notifications", icon: "🔔",  desc: "Alert preferences"          },
  { key: "billing",       label: "Billing",       icon: "💳",  desc: "Plan & payments"            },
  { key: "integrations",  label: "Integrations",  icon: "🔗",  desc: "Connect third-party tools"  },
  { key: "security",      label: "Security",      icon: "🔐",  desc: "Access & data security"     },
];

const cls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none border transition-all focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const sty = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };
function Lbl({ t }: { t: string }) {
  return <label className="block text-[10.5px] font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{t}</label>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--bz-border-hard)" }}>
        <p className="text-[13.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative h-6 w-11 rounded-full transition-all duration-200 shrink-0" style={{ backgroundColor: value ? "#6366F1" : "var(--bz-border-hard)" }}>
      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200" style={{ left: value ? "calc(100% - 22px)" : "2px" }} />
    </button>
  );
}
function SaveBtn({ label = "Save Changes" }: { label?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
      {saved ? "✓ Saved!" : label}
    </button>
  );
}

const TEAM_MEMBERS = [
  { name: "Arjun Kumar",  email: "arjun@billzcore.io",  role: "Admin",     status: "active",   avatar: "AK", color: "#6366F1" },
  { name: "Priya Menon",  email: "priya@billzcore.io",  role: "Recruiter", status: "active",   avatar: "PM", color: "#8B5CF6" },
  { name: "Rahul Sharma", email: "rahul@billzcore.io",  role: "Recruiter", status: "active",   avatar: "RS", color: "#10B981" },
  { name: "Sneha Iyer",   email: "sneha@billzcore.io",  role: "Junior",    status: "inactive", avatar: "SI", color: "#F59E0B" },
];

const INTEGRATIONS = [
  { name: "Google Workspace",  desc: "Sync calendar and email",       icon: "🔵", connected: true  },
  { name: "WhatsApp Business", desc: "Message candidates via WA",     icon: "🟢", connected: true  },
  { name: "LinkedIn Recruiter",desc: "Import LinkedIn profiles",      icon: "🔷", connected: false },
  { name: "QuickBooks",        desc: "Sync invoices and payments",    icon: "🟣", connected: false },
  { name: "Slack",             desc: "Team notifications in Slack",   icon: "🟡", connected: false },
  { name: "Zapier",            desc: "Automate workflows",            icon: "🔶", connected: false },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("general");
  const [mobileNav, setMobileNav] = useState(false);

  // General state
  const [general, setGeneral] = useState({
    companyName: "BillzCore Recruitment Solutions", email: "operations@billzcore.io",
    phone: "+971 4 123 4567", website: "www.billzcore.io",
    address: "Level 12, Dubai Trade Centre, UAE", currency: "AED",
    timezone: "Asia/Dubai", language: "English", dateFormat: "DD/MM/YYYY",
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    emailAlerts: true, pushAlerts: true, weeklyReport: true,
    placementAlerts: true, invoiceAlerts: true, systemUpdates: false,
    candidateUpdates: true, dealAlerts: false,
  });

  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sessionToggles, setSessionToggles] = useState({ twofa: false, sso: false, ipRestrict: false, sessionTimeout: true });

  const setG = (k: keyof typeof general) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setGeneral(f => ({ ...f, [k]: e.target.value }));

  const current = NAV.find(n => n.key === section)!;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>Settings</h1>
        <p className="text-[12px] sm:text-[13px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Manage your workspace configuration and preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Sidebar Nav */}
        <div className="sm:w-56 shrink-0">
          {/* Mobile toggle */}
          <button onClick={() => setMobileNav(v => !v)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-2.5 rounded-xl border mb-2 text-[13px] font-semibold"
            style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" }}>
            <span>{current.icon} {current.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={mobileNav ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} /></svg>
          </button>
          <nav className={`${mobileNav ? "flex" : "hidden"} sm:flex flex-col gap-0.5 rounded-xl border overflow-hidden`}
            style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            {NAV.map(n => (
              <button key={n.key} onClick={() => { setSection(n.key); setMobileNav(false); }}
                className="flex items-center gap-3 px-4 py-2.5 text-left transition-all"
                style={{ backgroundColor: section === n.key ? "rgba(99,102,241,0.08)" : "transparent", borderLeft: `2px solid ${section === n.key ? "#6366F1" : "transparent"}` }}>
                <span className="text-base shrink-0">{n.icon}</span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: section === n.key ? "#6366F1" : "var(--bz-text-1)" }}>{n.label}</p>
                  <p className="text-[10.5px] hidden sm:block" style={{ color: "var(--bz-text-3)" }}>{n.desc}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── GENERAL ─────────────────────────────────────────────────────── */}
          {section === "general" && (
            <>
              <Card title="Company Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><Lbl t="Company Name" /><input className={cls} style={sty} value={general.companyName} onChange={setG("companyName")} /></div>
                  <div><Lbl t="Email" /><input className={cls} style={sty} type="email" value={general.email} onChange={setG("email")} /></div>
                  <div><Lbl t="Phone" /><input className={cls} style={sty} value={general.phone} onChange={setG("phone")} /></div>
                  <div><Lbl t="Website" /><input className={cls} style={sty} value={general.website} onChange={setG("website")} /></div>
                  <div><Lbl t="Default Currency" />
                    <select className={cls} style={sty} value={general.currency} onChange={setG("currency")}>
                      {["AED","INR","SAR","OMR","USD","GBP"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2"><Lbl t="Address" /><input className={cls} style={sty} value={general.address} onChange={setG("address")} /></div>
                </div>
                <div className="mt-4 flex justify-end"><SaveBtn /></div>
              </Card>

              <Card title="Localisation">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><Lbl t="Timezone" />
                    <select className={cls} style={sty} value={general.timezone} onChange={setG("timezone")}>
                      {["Asia/Dubai","Asia/Calcutta","Asia/Riyadh","Europe/London","America/New_York"].map(tz => <option key={tz}>{tz}</option>)}
                    </select>
                  </div>
                  <div><Lbl t="Language" />
                    <select className={cls} style={sty} value={general.language} onChange={setG("language")}>
                      {["English","Arabic","Hindi","French"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div><Lbl t="Date Format" />
                    <select className={cls} style={sty} value={general.dateFormat} onChange={setG("dateFormat")}>
                      {["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD"].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end"><SaveBtn /></div>
              </Card>

              <Card title="Branding">
                <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl text-white font-extrabold text-lg" style={{ background: "var(--bz-gradient)" }}>BC</div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>Company Logo</p>
                    <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>PNG or SVG, max 2MB</p>
                    <button className="mt-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Upload Logo</button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* ── TEAM ─────────────────────────────────────────────────────────── */}
          {section === "team" && (
            <>
              <Card title="Team Members">
                <div className="space-y-1 mb-4">
                  {TEAM_MEMBERS.map(m => (
                    <div key={m.email} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(99,102,241,0.03)]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-[11px] font-extrabold"
                        style={{ background: `linear-gradient(135deg,${m.color},${m.color}aa)` }}>{m.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{m.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{m.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366F1" }}>{m.role}</span>
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{
                          backgroundColor: m.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.1)",
                          color: m.status === "active" ? "#10B981" : "#94A3B8",
                        }}>{m.status}</span>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[rgba(99,102,241,0.08)]" style={{ color: "var(--bz-text-3)" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Invite Team Member">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input className={`${cls} flex-1`} style={sty} type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                  <select className="h-9 rounded-lg px-3 text-[13px] outline-none border" style={{ ...sty, minWidth: "130px" }}>
                    {["Admin","Recruiter","Junior","Viewer"].map(r => <option key={r}>{r}</option>)}
                  </select>
                  <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white shrink-0" style={{ background: "var(--bz-gradient)" }}>Send Invite</button>
                </div>
              </Card>
            </>
          )}

          {/* ── NOTIFICATIONS ────────────────────────────────────────────────── */}
          {section === "notifications" && (
            <Card title="Notification Preferences">
              <div className="space-y-1">
                {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => {
                  const labels: Record<keyof typeof notifs, { t: string; d: string }> = {
                    emailAlerts:      { t: "Email Alerts",          d: "Receive important updates via email"              },
                    pushAlerts:       { t: "Push Notifications",    d: "Browser push notifications for live updates"      },
                    weeklyReport:     { t: "Weekly Report",         d: "Summary of key metrics every Monday"              },
                    placementAlerts:  { t: "Placement Updates",     d: "Notify when a candidate is placed"                },
                    invoiceAlerts:    { t: "Invoice Alerts",        d: "When invoices are paid or overdue"                },
                    systemUpdates:    { t: "System Updates",        d: "Product updates and release notes"                },
                    candidateUpdates: { t: "Candidate Stage Updates",d: "When a candidate moves to a new stage"          },
                    dealAlerts:       { t: "Deal & Proposal Alerts", d: "When proposals are accepted or rejected"         },
                  };
                  const info = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{info.t}</p>
                        <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{info.d}</p>
                      </div>
                      <Toggle value={val} onChange={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end"><SaveBtn label="Save Preferences" /></div>
            </Card>
          )}

          {/* ── BILLING ──────────────────────────────────────────────────────── */}
          {section === "billing" && (
            <>
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
                <div className="p-5" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: "#6366F1", color: "#fff" }}>Pro Plan</span>
                      <p className="text-[22px] font-extrabold mt-2" style={{ color: "var(--bz-text-1)" }}>AED 499 <span className="text-[14px] font-medium" style={{ color: "var(--bz-text-3)" }}>/month</span></p>
                      <p className="text-[12.5px] mt-1" style={{ color: "var(--bz-text-3)" }}>Up to 10 users · Unlimited job orders · Priority support</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg text-[12.5px] font-semibold border" style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Upgrade</button>
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {["Unlimited Clients","Unlimited Candidates","Invoice & Quotations","Sales Analytics","Job Tracker","API Access"].map(f => (
                      <span key={f} className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Card title="Billing Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Lbl t="Billing Name" /><input className={cls} style={sty} defaultValue="BillzCore Recruitment Solutions" /></div>
                  <div><Lbl t="Billing Email" /><input className={cls} style={sty} type="email" defaultValue="billing@billzcore.io" /></div>
                  <div className="sm:col-span-2"><Lbl t="Billing Address" /><input className={cls} style={sty} defaultValue="Level 12, Dubai Trade Centre, UAE" /></div>
                </div>
                <div className="mt-4 flex justify-end"><SaveBtn /></div>
              </Card>

              <Card title="Payment History">
                {[
                  { date: "Jun 1, 2026",  amount: "AED 499", status: "paid" },
                  { date: "May 1, 2026",  amount: "AED 499", status: "paid" },
                  { date: "Apr 1, 2026",  amount: "AED 499", status: "paid" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                    <span className="text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>{p.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[12.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>{p.amount}</span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>Paid</span>
                      <button className="text-[11.5px]" style={{ color: "#6366F1" }}>PDF</button>
                    </div>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ── INTEGRATIONS ─────────────────────────────────────────────────── */}
          {section === "integrations" && (
            <Card title="Connected Integrations">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrations.map((intg, i) => (
                  <div key={intg.name} className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)" }}>
                    <span className="text-2xl shrink-0">{intg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold" style={{ color: "var(--bz-text-1)" }}>{intg.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{intg.desc}</p>
                    </div>
                    <button
                      onClick={() => setIntegrations(prev => prev.map((it, idx) => idx === i ? { ...it, connected: !it.connected } : it))}
                      className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold shrink-0"
                      style={intg.connected
                        ? { backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }
                        : { backgroundColor: "rgba(99,102,241,0.08)", color: "#6366F1", border: "1px solid rgba(99,102,241,0.2)" }}>
                      {intg.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── SECURITY ─────────────────────────────────────────────────────── */}
          {section === "security" && (
            <>
              <Card title="Password Policy">
                <div className="space-y-3">
                  {[
                    { l: "Minimum password length", val: "8 characters" },
                    { l: "Require uppercase letter",  val: "Enabled"    },
                    { l: "Require numbers",           val: "Enabled"    },
                    { l: "Password expiry",           val: "90 days"    },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between items-center py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                      <span className="text-[12.5px]" style={{ color: "var(--bz-text-2)" }}>{r.l}</span>
                      <span className="text-[12.5px] font-bold" style={{ color: "#6366F1" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Session & Access">
                <div className="space-y-3">
                  {([
                    { label: "Two-Factor Authentication", desc: "Require 2FA for all users", key: "twofa"          },
                    { label: "Single Sign-On (SSO)",      desc: "Enable SSO via Google",     key: "sso"            },
                    { label: "IP Restriction",            desc: "Allow only office IPs",     key: "ipRestrict"     },
                    { label: "Session Timeout",           desc: "Auto-logout after 4h",      key: "sessionTimeout" },
                  ] as { label: string; desc: string; key: keyof typeof sessionToggles }[]).map(s => (
                    <div key={s.label} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{s.label}</p>
                        <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{s.desc}</p>
                      </div>
                      <Toggle value={sessionToggles[s.key]} onChange={() => setSessionToggles(t => ({ ...t, [s.key]: !t[s.key] }))} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Danger Zone">
                <div className="space-y-3">
                  {[
                    { label: "Export All Data",   desc: "Download a full export of your workspace data",   btnLabel: "Export",      color: "#6366F1" },
                    { label: "Delete Workspace",  desc: "Permanently delete your workspace and all data",   btnLabel: "Delete",      color: "#EF4444" },
                  ].map(a => (
                    <div key={a.label} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: a.color + "40", backgroundColor: a.color + "06" }}>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: a.color }}>{a.label}</p>
                        <p className="text-[11.5px]" style={{ color: "var(--bz-text-3)" }}>{a.desc}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border shrink-0"
                        style={{ borderColor: a.color, color: a.color }}>{a.btnLabel}</button>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
