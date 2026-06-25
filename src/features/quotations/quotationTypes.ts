export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  status: QuotationStatus;
  issueDate: string;
  validUntil: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  accountManager: string;
  convertedInvoiceId?: string;
}

export const STATUS_CONFIG: Record<QuotationStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "Draft",     color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  sent:      { label: "Sent",      color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  accepted:  { label: "Accepted",  color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  rejected:  { label: "Rejected",  color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
  expired:   { label: "Expired",   color: "#94A3B8", bg: "rgba(148,163,184,0.10)" },
  converted: { label: "Converted", color: "#8B5CF6", bg: "rgba(139,92,246,0.10)" },
};

let _id = 1;
function mk(): string { return String(_id++); }

function makeQuote(
  num: string, clientId: string, clientName: string, clientEmail: string, clientAddress: string,
  status: QuotationStatus, issueDate: string, validUntil: string, currency: string,
  items: { desc: string; qty: number; price: number }[],
  taxRate = 5, discount = 0, notes = ""
): Quotation {
  const lineItems: QuotationLineItem[] = items.map((it, i) => ({
    id: String(i + 1), description: it.desc,
    quantity: it.qty, unitPrice: it.price, amount: it.qty * it.price,
  }));
  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const taxAmount = Math.round(subtotal * taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return {
    id: mk(), quoteNumber: num, clientId, clientName, clientEmail, clientAddress,
    status, issueDate, validUntil, lineItems, subtotal, taxRate, taxAmount,
    discount, total, currency, notes, terms: "This quotation is valid until the date specified above.",
    accountManager: "Arjun Kumar",
  };
}

export const mockQuotations: Quotation[] = [
  makeQuote("QT-0021", "1", "Acme Corp", "ravi@acmecorp.ae", "Level 12, Dubai Trade Centre, UAE",
    "accepted", "2026-05-01", "2026-05-31", "AED",
    [{ desc: "Recruitment — 5 Civil Engineers", qty: 5, price: 8000 }, { desc: "Visa & Document Processing", qty: 5, price: 500 }],
    5, 2000, "Includes all recruitment and onboarding support."
  ),
  makeQuote("QT-0022", "2", "TechStart Ltd", "ananya@techstart.in", "Prestige Tech Park, Bangalore",
    "sent", "2026-06-01", "2026-06-30", "INR",
    [{ desc: "IT Staffing — React Developers", qty: 3, price: 85000 }, { desc: "Background Verification", qty: 3, price: 3500 }],
    18, 0
  ),
  makeQuote("QT-0020", "3", "Globex Inc", "fahad@globex.sa", "King Fahd Road, Riyadh",
    "converted", "2026-04-01", "2026-04-30", "SAR",
    [{ desc: "Workforce Supply — 10 Technicians", qty: 10, price: 12000 }, { desc: "Accommodation Coordination", qty: 10, price: 1500 }],
    15, 10000, "Bulk discount applied for 10+ placements."
  ),
  makeQuote("QT-0023", "4", "Nexus Co", "ibrahim@nexusco.mv", "H. Moodhuvali, Malé",
    "draft", "2026-06-10", "2026-07-10", "MVR",
    [{ desc: "Hospitality Staff Package — 8 Staff", qty: 8, price: 14000 }],
    0, 5000
  ),
  makeQuote("QT-0019", "5", "BrightWave", "layla@brightwave.om", "Ghala Industrial Area, Muscat",
    "rejected", "2026-03-01", "2026-03-31", "OMR",
    [{ desc: "Manufacturing Workforce Consulting", qty: 1, price: 8000 }, { desc: "Recruitment — 6 Operators", qty: 6, price: 2500 }],
    5, 0, "Client requested revised pricing."
  ),
  makeQuote("QT-0024", "8", "Pinnacle Corp", "sara@pinnacle.bh", "Seef District, Manama",
    "sent", "2026-06-15", "2026-07-15", "BHD",
    [{ desc: "Property Management Staff — 3 Managers", qty: 3, price: 3500 }, { desc: "Relocation & Onboarding Support", qty: 3, price: 800 }],
    10, 0
  ),
  makeQuote("QT-0018", "1", "Acme Corp", "ravi@acmecorp.ae", "Level 12, Dubai Trade Centre, UAE",
    "expired", "2026-02-01", "2026-02-28", "AED",
    [{ desc: "Recruitment — 2 Site Supervisors", qty: 2, price: 9000 }],
    5, 0, "Quote expired. Follow up for renewal."
  ),
  makeQuote("QT-0025", "6", "Orion Systems", "nasser@orionsys.kw", "Salmiya, Kuwait City",
    "draft", "2026-06-20", "2026-07-20", "KWD",
    [{ desc: "Telecom Workforce Supply — 4 Engineers", qty: 4, price: 5500 }, { desc: "Training & Certification Support", qty: 4, price: 800 }],
    5, 0, "Initial proposal for prospect client."
  ),
];
