"use client";

import { useState } from "react";

const TABS = ["profile", "activity", "settings", "security"] as const;
type Tab = typeof TABS[number];

const INIT = {
  name: "Arjun Kumar", email: "arjun.kumar@billzcore.io", phone: "+971 50 123 4567",
  role: "Senior Recruiter", department: "Recruitment", location: "Dubai, UAE",
  bio: "Senior Recruiter specializing in engineering and technology placements across the GCC and South Asia markets. 6+ years of experience building high-performing teams.",
  linkedin: "linkedin.com/in/arjunkumar", timezone: "Asia/Dubai", language: "English",
};

const RECENT_ACTIVITY = [
  { action: "Placed candidate",      detail: "Aditya Sharma → Acme Corp (Civil Engineer)",   time: "2 hours ago",   icon: "✅", color: "#10B981" },
  { action: "Posted job order",      detail: "JO-1008: Structural Engineer — Acme Corp",       time: "Yesterday",     icon: "📋", color: "#6366F1" },
  { action: "Updated proposal",      detail: "PR-0012: IT Staffing Solution — TechStart Ltd",  time: "2 days ago",    icon: "📝", color: "#8B5CF6" },
  { action: "Invoice paid",          detail: "INV-0042 — AED 55,125 from Acme Corp",           time: "3 days ago",    icon: "💰", color: "#10B981" },
  { action: "Interview scheduled",   detail: "Priya Menon & 3 candidates — TechStart Ltd",     time: "4 days ago",    icon: "🎤", color: "#F59E0B" },
  { action: "Quotation accepted",    detail: "QT-0021 — Acme Corp — AED 47,500",               time: "5 days ago",    icon: "🤝", color: "#10B981" },
  { action: "New client added",      detail: "Orion Systems — Kuwait City",                    time: "1 week ago",    icon: "🏢", color: "#06B6D4" },
  { action: "Report generated",      detail: "Monthly Sales Report — May 2026",                time: "1 week ago",    icon: "📊", color: "#F59E0B" },
];

const STATS = [
  { label: "Placements YTD", value: "28",    color: "#6366F1" },
  { label: "Active Jobs",    value: "12",    color: "#10B981" },
  { label: "Client Sat.",    value: "92%",   color: "#8B5CF6" },
  { label: "Close Rate",     value: "78%",   color: "#F59E0B" },
];

const cls = "w-full h-9 rounded-lg px-3 text-[13px] outline-none border transition-all focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]";
const sty = { backgroundColor: "var(--bz-bg)", borderColor: "var(--bz-border-hard)", color: "var(--bz-text-1)" };
function Lbl({ t }: { t: string }) {
  return <label className="block text-[10.5px] font-bold mb-1 uppercase tracking-wide" style={{ color: "var(--bz-text-3)" }}>{t}</label>;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border p-5 ${className}`} style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>{children}</div>;
}

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [form, setForm]   = useState(INIT);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true, pushAlerts: true, weeklyReport: true,
    placementAlerts: true, invoiceAlerts: false, systemUpdates: false,
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  function saveProfile() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const initials = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-5 pb-8">
      {/* Profile Hero */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        {/* Banner */}
        <div className="h-24 sm:h-32" style={{ background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#06B6D4 100%)" }} />
        <div className="px-5 sm:px-6 pb-5">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 sm:-mt-12">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl text-white text-[22px] sm:text-[26px] font-extrabold border-4 shadow-xl"
                  style={{ background: "var(--bz-gradient)", borderColor: "var(--bz-card-bg)" }}>
                  {initials}
                </div>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 flex items-center justify-center rounded-full border-2 text-white text-[11px]"
                  style={{ background: "var(--bz-gradient)", borderColor: "var(--bz-card-bg)" }}>✏</button>
              </div>
              <div className="mb-1">
                <p className="text-[17px] sm:text-[20px] font-extrabold" style={{ color: "var(--bz-text-1)" }}>{form.name}</p>
                <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-3)" }}>{form.role} · {form.department}</p>
                <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>📍 {form.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold text-white" style={{ background: "var(--bz-gradient)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-white opacity-80" />Active
              </span>
              <button onClick={() => setActiveTab("profile")} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border"
                style={{ borderColor: "var(--bz-border-hard)", color: "var(--bz-text-2)" }}>Edit Profile</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-[18px] sm:text-[20px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10.5px] sm:text-[11px]" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t overflow-x-auto px-2 sm:px-5" style={{ borderColor: "var(--bz-border-hard)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-3 text-[12px] sm:text-[12.5px] font-semibold capitalize border-b-2 transition-all shrink-0"
              style={{ borderBottomColor: activeTab === tab ? "#6366F1" : "transparent", color: activeTab === tab ? "#6366F1" : "var(--bz-text-3)" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROFILE TAB ───────────────────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-4">
            <Card>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>Personal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Lbl t="Full Name" /><input className={cls} style={sty} value={form.name} onChange={set("name")} /></div>
                <div><Lbl t="Email" /><input className={cls} style={sty} type="email" value={form.email} onChange={set("email")} /></div>
                <div><Lbl t="Phone" /><input className={cls} style={sty} value={form.phone} onChange={set("phone")} /></div>
                <div><Lbl t="Location" /><input className={cls} style={sty} value={form.location} onChange={set("location")} /></div>
                <div><Lbl t="LinkedIn" /><input className={cls} style={sty} value={form.linkedin} onChange={set("linkedin")} /></div>
                <div>
                  <Lbl t="Timezone" />
                  <select className={cls} style={sty} value={form.timezone} onChange={set("timezone")}>
                    {["Asia/Dubai","Asia/Calcutta","Asia/Riyadh","Europe/London","America/New_York"].map(tz => <option key={tz}>{tz}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Lbl t="Bio" />
                  <textarea className="w-full rounded-lg px-3 py-2 text-[13px] outline-none border resize-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
                    style={sty} rows={3} value={form.bio} onChange={set("bio")} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--bz-border-hard)" }}>
                {saved && <span className="text-[12px] font-semibold" style={{ color: "#10B981" }}>✓ Saved!</span>}
                <button onClick={saveProfile} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
                  Save Changes
                </button>
              </div>
            </Card>

            <Card>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>Work Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Lbl t="Role" /><input className={cls} style={sty} value={form.role} onChange={set("role")} /></div>
                <div><Lbl t="Department" /><input className={cls} style={sty} value={form.department} onChange={set("department")} /></div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Contact</p>
              {[{ icon: "✉️", val: form.email }, { icon: "📞", val: form.phone }, { icon: "🔗", val: form.linkedin }, { icon: "📍", val: form.location }].map(r => (
                <div key={r.icon} className="flex items-center gap-2.5 py-2 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                  <span className="text-base">{r.icon}</span>
                  <span className="text-[12.5px] truncate" style={{ color: "var(--bz-text-2)" }}>{r.val}</span>
                </div>
              ))}
            </Card>
            <Card>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Performance Snapshot</p>
              {[
                { label: "Placements (YTD)",   value: "28 / 30",   color: "#6366F1", pct: 93 },
                { label: "Revenue (YTD)",       value: "94% of target", color: "#10B981", pct: 94 },
                { label: "Avg Time to Fill",    value: "18 days",   color: "#F59E0B", pct: 72 },
                { label: "Candidate Quality",   value: "88 / 100",  color: "#8B5CF6", pct: 88 },
              ].map(s => (
                <div key={s.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-[11.5px] mb-1">
                    <span style={{ color: "var(--bz-text-3)" }}>{s.label}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "activity" && (
        <Card>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>Recent Activity</p>
          <div className="relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-px" style={{ backgroundColor: "var(--bz-border-hard)" }} />
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-4 pl-1">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm border-2"
                    style={{ backgroundColor: "var(--bz-card-bg)", borderColor: a.color }}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{a.action}</p>
                      <span className="text-[10.5px] shrink-0" style={{ color: "var(--bz-text-3)" }}>{a.time}</span>
                    </div>
                    <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>{a.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ── SETTINGS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>Notification Preferences</p>
            <div className="space-y-3">
              {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
                const labels: Record<keyof typeof notifications, string> = {
                  emailAlerts: "Email Alerts", pushAlerts: "Push Notifications", weeklyReport: "Weekly Report",
                  placementAlerts: "Placement Notifications", invoiceAlerts: "Invoice Alerts", systemUpdates: "System Updates",
                };
                return (
                  <div key={key} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                    <div>
                      <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{labels[key]}</p>
                      <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{val ? "Enabled" : "Disabled"}</p>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                      className="relative h-6 w-11 rounded-full transition-all duration-200 shrink-0"
                      style={{ backgroundColor: val ? "#6366F1" : "var(--bz-border-hard)" }}>
                      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200"
                        style={{ left: val ? "calc(100% - 22px)" : "2px" }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>Display & Preferences</p>
            <div className="space-y-4">
              <div>
                <Lbl t="Language" />
                <select className={cls} style={sty} value={form.language} onChange={set("language")}>
                  {["English", "Arabic", "Hindi", "French"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <Lbl t="Timezone" />
                <select className={cls} style={sty} value={form.timezone} onChange={set("timezone")}>
                  {["Asia/Dubai","Asia/Calcutta","Asia/Riyadh","Europe/London","America/New_York"].map(tz => <option key={tz}>{tz}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>Compact Mode</p>
                  <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>Reduce spacing in tables</p>
                </div>
                <div className="h-6 w-11 rounded-full cursor-pointer" style={{ backgroundColor: "var(--bz-border-hard)" }}>
                  <span className="block mt-0.5 ml-0.5 h-5 w-5 rounded-full bg-white shadow" />
                </div>
              </div>
            </div>
            <button onClick={saveProfile} className="mt-4 px-5 py-2 rounded-lg text-[13px] font-semibold text-white w-full" style={{ background: "var(--bz-gradient)" }}>
              {saved ? "✓ Saved!" : "Save Preferences"}
            </button>
          </Card>
        </div>
      )}

      {/* ── SECURITY TAB ─────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: "var(--bz-text-3)" }}>Change Password</p>
            <div className="space-y-3">
              <div><Lbl t="Current Password" /><input className={cls} style={sty} type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" /></div>
              <div><Lbl t="New Password" /><input className={cls} style={sty} type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} placeholder="••••••••" /></div>
              <div><Lbl t="Confirm New Password" /><input className={cls} style={sty} type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" /></div>
              {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                <p className="text-[11.5px] font-semibold" style={{ color: "#EF4444" }}>Passwords do not match</p>
              )}
              <button className="w-full px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white mt-1" style={{ background: "var(--bz-gradient)" }}>
                Update Password
              </button>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Two-Factor Authentication</p>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: "var(--bz-text-1)" }}>2FA Not Enabled</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "var(--bz-text-3)" }}>Add an extra layer of security to your account.</p>
                  <button className="mt-3 px-4 py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
                    Enable 2FA
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Active Sessions</p>
              {[
                { device: "Chrome · macOS",  location: "Dubai, UAE",    time: "Now",          current: true  },
                { device: "Safari · iPhone", location: "Dubai, UAE",    time: "2 hours ago",  current: false },
                { device: "Chrome · Windows",location: "Bangalore, IN", time: "3 days ago",   current: false },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[12.5px] font-semibold" style={{ color: "var(--bz-text-1)" }}>{s.device}</p>
                      {s.current && <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>This device</span>}
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--bz-text-3)" }}>{s.location} · {s.time}</p>
                  </div>
                  {!s.current && (
                    <button className="text-[11.5px] font-semibold" style={{ color: "#EF4444" }}>Revoke</button>
                  )}
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
