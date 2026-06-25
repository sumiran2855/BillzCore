export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled" | "partial";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  currency: string;
  notes?: string;
  terms?: string;
  accountManager: string;
}

export const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: "Draft",     color: "#64748B", bg: "rgba(100,116,139,0.10)" },
  sent:      { label: "Sent",      color: "#6366F1", bg: "rgba(99,102,241,0.10)" },
  paid:      { label: "Paid",      color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  overdue:   { label: "Overdue",   color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
  cancelled: { label: "Cancelled", color: "#94A3B8", bg: "rgba(148,163,184,0.10)" },
  partial:   { label: "Partial",   color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
};

let idCounter = 1;
function mkId() { return String(idCounter++); }

function makeInvoice(
  num: string, clientId: string, clientName: string, clientEmail: string, clientAddress: string,
  status: InvoiceStatus, issueDate: string, dueDate: string, currency: string,
  items: { desc: string; qty: number; price: number }[],
  taxRate = 5, discount = 0, amountPaid = 0, notes = ""
): Invoice {
  const lineItems: InvoiceLineItem[] = items.map((it, i) => ({
    id: String(i + 1), description: it.desc, quantity: it.qty,
    unitPrice: it.price, amount: it.qty * it.price,
  }));
  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const taxAmount = Math.round(subtotal * taxRate / 100);
  const total = subtotal + taxAmount - discount;
  return {
    id: mkId(), invoiceNumber: num, clientId, clientName, clientEmail, clientAddress,
    status, issueDate, dueDate, lineItems, subtotal, taxRate, taxAmount,
    discount, total, amountPaid: status === "paid" ? total : amountPaid,
    currency, notes, terms: "Payment due within 30 days of invoice date.", accountManager: "Arjun Kumar",
  };
}

export const mockInvoices: Invoice[] = [
  makeInvoice("INV-0042", "1", "Acme Corp", "ravi@acmecorp.ae", "Level 12, Dubai Trade Centre, UAE",
    "paid", "2026-05-01", "2026-05-31", "AED",
    [{ desc: "Recruitment Service — 3 Engineers", qty: 3, price: 8000 }, { desc: "Visa Processing Fee", qty: 3, price: 500 }],
    5, 0, 0, "Thank you for your continued business."
  ),
  makeInvoice("INV-0043", "2", "TechStart Ltd", "ananya@techstart.in", "Prestige Tech Park, Bangalore, India",
    "sent", "2026-05-15", "2026-06-14", "INR",
    [{ desc: "Recruitment Service — React Developer", qty: 1, price: 85000 }, { desc: "Background Verification", qty: 1, price: 3500 }],
    18, 0, 0
  ),
  makeInvoice("INV-0041", "3", "Globex Inc", "fahad@globex.sa", "King Fahd Road, Riyadh, Saudi Arabia",
    "overdue", "2026-04-01", "2026-04-30", "SAR",
    [{ desc: "Workforce Supply — 8 Technicians", qty: 8, price: 12000 }, { desc: "Accommodation Arrangement", qty: 8, price: 2000 }],
    15, 5000, 0, "Please settle by due date to avoid late fees."
  ),
  makeInvoice("INV-0044", "4", "Nexus Co", "ibrahim@nexusco.mv", "H. Moodhuvali, Malé, Maldives",
    "draft", "2026-06-01", "2026-06-30", "MVR",
    [{ desc: "Hospitality Staff Placement — 5 Staff", qty: 5, price: 15000 }],
    0, 0, 0
  ),
  makeInvoice("INV-0040", "5", "BrightWave", "layla@brightwave.om", "Ghala Industrial Area, Muscat, Oman",
    "paid", "2026-03-01", "2026-03-31", "OMR",
    [{ desc: "Onboarding Consultancy", qty: 1, price: 5000 }, { desc: "Document Processing", qty: 6, price: 200 }],
    5, 0, 0
  ),
  makeInvoice("INV-0045", "8", "Pinnacle Corp", "sara@pinnacle.bh", "Seef District, Manama, Bahrain",
    "partial", "2026-06-10", "2026-07-10", "BHD",
    [{ desc: "Recruitment — Property Managers", qty: 2, price: 3500 }, { desc: "Relocation Support", qty: 2, price: 800 }],
    10, 0, 3500
  ),
  makeInvoice("INV-0038", "3", "Globex Inc", "fahad@globex.sa", "King Fahd Road, Riyadh, Saudi Arabia",
    "paid", "2026-02-01", "2026-02-28", "SAR",
    [{ desc: "Workforce Supply — 5 Technicians", qty: 5, price: 12000 }],
    15, 0, 0
  ),
  makeInvoice("INV-0039", "1", "Acme Corp", "ravi@acmecorp.ae", "Level 12, Dubai Trade Centre, UAE",
    "cancelled", "2026-03-15", "2026-04-15", "AED",
    [{ desc: "Recruitment Service — Project Manager", qty: 1, price: 12000 }],
    5, 0, 0, "Cancelled per client request."
  ),
];
