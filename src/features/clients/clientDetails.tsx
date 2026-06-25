"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { mockClients, ClientStatus } from "./clientTypes";
import ClientModal from "./clientModal";

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  active:     { label: "Active",     color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  inactive:   { label: "Inactive",   color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  prospect:   { label: "Prospect",   color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  onboarding: { label: "Onboarding", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  churned:    { label: "Churned",    color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
};

const COLORS = ["#6366F1","#8B5CF6","#10B981","#06B6D4","#F59E0B","#EF4444","#EC4899"];
function avatarColor(id: string) { return COLORS[parseInt(id) % COLORS.length]; }
function initials(name: string) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--bz-border-hard)" }}>
      <span className="text-[12px] w-32 shrink-0" style={{ color: "var(--bz-text-3)" }}>{label}</span>
      <span className="text-[12.5px] font-semibold text-right" style={{ color: "var(--bz-text-1)" }}>{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
      <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>{title}</p>
      {children}
    </div>
  );
}

const TABS = ["overview", "contacts", "invoices", "notes"] as const;
type Tab = typeof TABS[number];

export default function ClientDetailPage() {
  const params = useParams();
  const [clients, setClients] = useState(mockClients);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const client = clients.find(c => c.id === params?.id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <span className="text-5xl">🏢</span>
        <p className="text-[15px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Client not found</p>
        <Link href="/dashboard/clients">
          <button className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: "var(--bz-gradient)" }}>
            ← Back to Clients
          </button>
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[client.status];
  const color = avatarColor(client.id);

  function handleSave(form: any) {
    setClients(prev => prev.map(c => c.id === client!.id ? { ...c, ...form } : c));
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: "var(--bz-text-3)" }}>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/clients" className="hover:underline">Clients</Link>
        <span>/</span>
        <span style={{ color: "var(--bz-text-1)" }}>{client.companyName}</span>
      </div>

      {/* Hero Card */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${color},${color}77)` }} />
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left: identity */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl text-white text-[18px] sm:text-[22px] font-extrabold shadow-lg"
                style={{ background: `linear-gradient(135deg,${color},${color}bb)` }}>
                {initials(client.companyName)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-[18px] sm:text-[22px] font-extrabold tracking-tight" style={{ color: "var(--bz-text-1)" }}>
                    {client.companyName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] font-semibold" style={{ color: "var(--bz-text-2)" }}>{client.industry}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                  <span className="text-[11px] sm:text-[12px]" style={{ color: "var(--bz-text-3)" }}>{client.code}</span>
                  <span className="text-[11px] sm:text-[12px]" style={{ color: "var(--bz-text-3)" }}>📍 {client.city}, {client.country}</span>
                  {client.website && (
                    <a href={client.website} target="_blank" rel="noreferrer" className="text-[11px] sm:text-[12px] hover:underline" style={{ color: "#6366F1" }}>
                      🌐 {client.website.replace("https://", "")}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: stats + actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: "Revenue",    value: `${client.currency} ${(client.totalRevenue/1000).toFixed(0)}K`, color: "#6366F1" },
                  { label: "Deals",      value: String(client.totalDeals), color: "#10B981" },
                  { label: "Candidates", value: String(client.activeCandidates), color: "#F59E0B" },
                ].map(s => (
                  <div key={s.label} className="rounded-lg border px-3 py-2 text-center min-w-[64px]" style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)" }}>
                    <p className="text-[14px] sm:text-[15px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[9.5px] font-semibold" style={{ color: "var(--bz-text-3)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[12.5px] font-semibold text-white"
                  style={{ background: "var(--bz-gradient)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[12.5px] font-semibold border"
                  style={{ borderColor: "var(--bz-border-hard)", backgroundColor: "var(--bz-bg)", color: "var(--bz-text-2)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Quick info strip */}
          <div className="mt-4 pt-4 border-t flex items-center gap-3 sm:gap-5 flex-wrap" style={{ borderColor: "var(--bz-border-hard)" }}>
            {[
              { icon: "👤", label: `${client.contactName} (${client.contactRole})` },
              { icon: "📧", label: client.contactEmail },
              { icon: "📱", label: client.contactPhone },
              { icon: "📅", label: `Since ${client.contractStart}` },
            ].map(item => (
              <div key={item.icon} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] min-w-0" style={{ color: "var(--bz-text-3)" }}>
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-t overflow-x-auto px-2 sm:px-5" style={{ borderColor: "var(--bz-border-hard)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 sm:px-4 py-3 text-[12px] sm:text-[12.5px] font-semibold capitalize border-b-2 transition-all shrink-0"
              style={{ borderBottomColor: activeTab === tab ? "#6366F1" : "transparent", color: activeTab === tab ? "#6366F1" : "var(--bz-text-3)" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <Section title="Company Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="Company Name" value={client.companyName} />
                  <InfoRow label="Industry" value={client.industry} />
                  <InfoRow label="Country" value={client.country} />
                  <InfoRow label="City" value={client.city} />
                </div>
                <div>
                  <InfoRow label="Client Code" value={client.code} />
                  <InfoRow label="Website" value={client.website} />
                  <InfoRow label="Address" value={client.address} />
                  <InfoRow label="Registered" value={client.registeredDate} />
                </div>
              </div>
            </Section>

            <Section title="Primary Contact">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-[13px] font-bold" style={{ background: "var(--bz-gradient)" }}>
                  {initials(client.contactName)}
                </span>
                <div>
                  <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{client.contactName}</p>
                  <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{client.contactRole}</p>
                </div>
              </div>
              <InfoRow label="Email" value={client.contactEmail} />
              <InfoRow label="Phone" value={client.contactPhone} />
            </Section>
          </div>

          <div className="space-y-5">
            <Section title="Contract Details">
              <InfoRow label="Status" value={cfg.label} />
              <InfoRow label="Start Date" value={client.contractStart} />
              <InfoRow label="End Date" value={client.contractEnd || "Open-ended"} />
              <InfoRow label="Account Manager" value={client.accountManager} />
              <InfoRow label="Currency" value={client.currency} />
            </Section>

            <Section title="Financial Summary">
              <div className="space-y-3">
                {[
                  { label: "Total Revenue", value: `${client.currency} ${client.totalRevenue.toLocaleString()}`, color: "#6366F1" },
                  { label: "Total Deals", value: String(client.totalDeals), color: "#10B981" },
                  { label: "Active Candidates", value: String(client.activeCandidates), color: "#F59E0B" },
                  { label: "Open Invoices", value: String(client.openInvoices), color: client.openInvoices > 0 ? "#EF4444" : "#10B981" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{row.label}</span>
                    <span className="text-[13px] font-bold" style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-4">
          {/* Primary */}
          <div className="rounded-xl border p-4 sm:p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--bz-text-3)" }}>Primary Contact</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366F1" }}>Primary</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-[12px] font-bold" style={{ background: "var(--bz-gradient)" }}>
                {initials(client.contactName)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{client.contactName}</p>
                <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{client.contactRole}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-[11.5px]" style={{ color: "var(--bz-text-2)" }}>📧 {client.contactEmail}</span>
                  <span className="text-[11.5px]" style={{ color: "var(--bz-text-2)" }}>📱 {client.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional contacts */}
          {(client.contacts || []).map((contact, i) => (
            <div key={i} className="rounded-xl border p-4 sm:p-5" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-[12px] font-bold"
                  style={{ background: `linear-gradient(135deg,${avatarColor(String(i + 10))},${avatarColor(String(i + 10))}aa)` }}>
                  {initials(contact.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold" style={{ color: "var(--bz-text-1)" }}>{contact.name}</p>
                  <p className="text-[12px]" style={{ color: "var(--bz-text-3)" }}>{contact.role}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[11.5px]" style={{ color: "var(--bz-text-2)" }}>📧 {contact.email}</span>
                    <span className="text-[11.5px]" style={{ color: "var(--bz-text-2)" }}>📱 {contact.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!client.contacts || client.contacts.length === 0) && (
            <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
              <p className="text-[13px]" style={{ color: "var(--bz-text-3)" }}>No additional contacts added yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="rounded-xl border p-8 text-center" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <span className="text-4xl">🧾</span>
          <p className="mt-3 text-[14px] font-semibold" style={{ color: "var(--bz-text-2)" }}>Invoices</p>
          <p className="text-[12.5px] mt-1" style={{ color: "var(--bz-text-3)" }}>
            {client.openInvoices > 0 ? `${client.openInvoices} open invoice(s) pending` : "No open invoices"}
          </p>
          <p className="text-[11.5px] mt-3" style={{ color: "var(--bz-text-3)" }}>Full invoice management coming soon.</p>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="rounded-xl border p-5 sm:p-6" style={{ backgroundColor: "var(--bz-card-bg)", borderColor: "var(--bz-border-hard)" }}>
          <p className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--bz-text-3)" }}>Internal Notes</p>
          {client.notes ? (
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--bz-text-2)" }}>{client.notes}</p>
          ) : (
            <p className="text-[13px]" style={{ color: "var(--bz-text-3)" }}>No notes added for this client.</p>
          )}
        </div>
      )}

      <ClientModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        client={client}
        mode="edit"
      />
    </div>
  );
}
