export type ProposalStatus = "draft" | "sent" | "under_review" | "accepted" | "rejected" | "expired";

export interface ProposalLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  status: ProposalStatus;
  issueDate: string;
  validUntil: string;
  // Content
  executiveSummary: string;
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  // Pricing
  lineItems: ProposalLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  // Meta
  probability: number; // 0–100
  accountManager: string;
  notes?: string;
  terms?: string;
}

export const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; bg: string }> = {
  draft:        { label: "Draft",        color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  sent:         { label: "Sent",         color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  under_review: { label: "Under Review", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  accepted:     { label: "Accepted",     color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  rejected:     { label: "Rejected",     color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
  expired:      { label: "Expired",      color: "#94A3B8", bg: "rgba(148,163,184,0.10)" },
};

let _id = 1;
function mk() { return String(_id++); }

function makeProposal(
  num: string, title: string, clientId: string, clientName: string, clientEmail: string, clientAddress: string,
  status: ProposalStatus, issueDate: string, validUntil: string, currency: string,
  items: { desc: string; qty: number; price: number }[],
  probability: number, taxRate = 5, discount = 0,
  summary = "", scope = "", deliverables = "", timeline = ""
): Proposal {
  const lineItems: ProposalLineItem[] = items.map((it, i) => ({
    id: String(i + 1), description: it.desc,
    quantity: it.qty, unitPrice: it.price, amount: it.qty * it.price,
  }));
  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const taxAmount = Math.round(subtotal * taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return {
    id: mk(), proposalNumber: num, title, clientId, clientName, clientEmail, clientAddress,
    status, issueDate, validUntil, lineItems, subtotal, taxRate, taxAmount,
    discount, total, currency, probability, accountManager: "Arjun Kumar",
    executiveSummary: summary || `We are pleased to present this proposal for ${clientName}. Our team brings deep expertise in recruitment and workforce solutions tailored to your industry requirements.`,
    scopeOfWork: scope || "End-to-end recruitment services including candidate sourcing, screening, interviews, offer management, and onboarding coordination.",
    deliverables: deliverables || "• Shortlisted candidate profiles\n• Interview coordination\n• Background verification reports\n• Onboarding documentation support",
    timeline: timeline || "Week 1–2: Requirements gathering & sourcing\nWeek 3–4: Screening & shortlisting\nWeek 5–6: Interviews & selection\nWeek 7–8: Offer & onboarding",
    terms: "This proposal is valid until the date specified. Services commence upon signed agreement receipt.",
  };
}

export const mockProposals: Proposal[] = [
  makeProposal("PR-0011", "Engineering Workforce Supply — Q3 2026", "1", "Acme Corp", "ravi@acmecorp.ae", "Level 12, Dubai Trade Centre, UAE",
    "accepted", "2026-05-01", "2026-05-31", "AED",
    [{ desc: "Recruitment — 5 Civil Engineers", qty: 5, price: 8500 }, { desc: "Onboarding & Visa Support", qty: 5, price: 600 }, { desc: "Project Management Fee", qty: 1, price: 5000 }],
    95, 5, 3000,
    "Acme Corp requires a scalable engineering workforce for their upcoming Q3 construction projects. BillzCore proposes a comprehensive end-to-end recruitment solution covering sourcing, screening, visa processing, and onboarding.",
    "Full-cycle recruitment for 5 Civil Engineers including job posting, candidate sourcing, technical screening, client interviews, offer negotiation, visa documentation, and onboarding.",
    "• 5 shortlisted Civil Engineer profiles per role\n• Technical assessment coordination\n• Visa & document processing\n• Onboarding checklist and support",
    "Week 1: JD finalisation & sourcing\nWeek 2–3: Screening & interviews\nWeek 4: Offer management\nWeek 5–6: Visa & onboarding"
  ),
  makeProposal("PR-0012", "IT Staffing Solution — FY 2026", "2", "TechStart Ltd", "ananya@techstart.in", "Prestige Tech Park, Bangalore",
    "sent", "2026-06-01", "2026-06-30", "INR",
    [{ desc: "IT Staffing — React & Node Developers", qty: 4, price: 90000 }, { desc: "Technical Assessment Setup", qty: 1, price: 15000 }],
    70, 18, 0,
    "TechStart Ltd is scaling its engineering team rapidly. We propose a dedicated staffing solution covering full-stack developers with React and Node.js expertise.",
  ),
  makeProposal("PR-0010", "Large-Scale Workforce Deployment", "3", "Globex Inc", "fahad@globex.sa", "King Fahd Road, Riyadh",
    "accepted", "2026-04-01", "2026-04-30", "SAR",
    [{ desc: "Workforce Supply — 12 Field Technicians", qty: 12, price: 13000 }, { desc: "Accommodation & Logistics Coordination", qty: 12, price: 2000 }, { desc: "Compliance & Documentation", qty: 1, price: 8000 }],
    90, 15, 15000
  ),
  makeProposal("PR-0013", "Hospitality Staffing Package 2026", "4", "Nexus Co", "ibrahim@nexusco.mv", "H. Moodhuvali, Malé",
    "under_review", "2026-06-10", "2026-07-10", "MVR",
    [{ desc: "Hospitality Staff Recruitment — 10 Staff", qty: 10, price: 16000 }, { desc: "Training Coordination", qty: 1, price: 12000 }],
    55, 0, 8000
  ),
  makeProposal("PR-0009", "Manufacturing Talent Acquisition", "5", "BrightWave", "layla@brightwave.om", "Ghala Industrial Area, Muscat",
    "rejected", "2026-03-01", "2026-03-31", "OMR",
    [{ desc: "Manufacturing Operators Recruitment", qty: 8, price: 2800 }, { desc: "Skill Assessment Programme", qty: 1, price: 4500 }],
    0, 5, 0, "Client opted for internal hiring."
  ),
  makeProposal("PR-0014", "Real Estate Talent Partnership", "8", "Pinnacle Corp", "sara@pinnacle.bh", "Seef District, Manama",
    "draft", "2026-06-20", "2026-07-20", "BHD",
    [{ desc: "Property Manager Recruitment — 3 Positions", qty: 3, price: 4000 }, { desc: "Executive Search — VP Operations", qty: 1, price: 12000 }],
    40, 10, 0
  ),
  makeProposal("PR-0015", "Telecom Specialist Sourcing", "6", "Orion Systems", "nasser@orionsys.kw", "Salmiya, Kuwait City",
    "sent", "2026-06-22", "2026-07-22", "KWD",
    [{ desc: "Telecom Engineers Recruitment", qty: 5, price: 6000 }, { desc: "Certification & Compliance Support", qty: 5, price: 900 }],
    60, 5, 0
  ),
  makeProposal("PR-0008", "Annual Staffing Retainer Proposal", "1", "Acme Corp", "ravi@acmecorp.ae", "Level 12, Dubai Trade Centre, UAE",
    "expired", "2026-02-01", "2026-02-28", "AED",
    [{ desc: "Annual Retainer — Preferred Employer Programme", qty: 1, price: 120000 }],
    0, 5, 10000
  ),
];
