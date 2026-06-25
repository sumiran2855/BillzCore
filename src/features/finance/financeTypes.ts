// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = "income" | "expense" | "refund" | "transfer";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
  clientName?: string;
}

export interface ExpenseCategory {
  label: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const TX_TYPE_CONFIG: Record<TransactionType, { label: string; color: string; bg: string; sign: "+" | "-" }> = {
  income:   { label: "Income",   color: "#10B981", bg: "rgba(16,185,129,0.10)",  sign: "+" },
  expense:  { label: "Expense",  color: "#EF4444", bg: "rgba(239,68,68,0.10)",   sign: "-" },
  refund:   { label: "Refund",   color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  sign: "+" },
  transfer: { label: "Transfer", color: "#6366F1", bg: "rgba(99,102,241,0.10)",  sign: "-" },
};

export const TX_STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; bg: string }> = {
  completed: { label: "Completed", color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  pending:   { label: "Pending",   color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  failed:    { label: "Failed",    color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  { id: "1",  date: "2026-06-24", description: "Invoice INV-0042 Payment",        type: "income",   category: "Recruitment",    amount: 55125,  currency: "AED", status: "completed", reference: "INV-0042", clientName: "Acme Corp" },
  { id: "2",  date: "2026-06-23", description: "Office Rent — June 2026",         type: "expense",  category: "Operations",     amount: 12000,  currency: "AED", status: "completed", reference: "EXP-061" },
  { id: "3",  date: "2026-06-22", description: "Invoice INV-0040 Payment",        type: "income",   category: "Consultancy",    amount: 16275,  currency: "OMR", status: "completed", reference: "INV-0040", clientName: "BrightWave" },
  { id: "4",  date: "2026-06-21", description: "Staff Salaries — June",           type: "expense",  category: "Payroll",        amount: 85000,  currency: "AED", status: "completed", reference: "PAY-062" },
  { id: "5",  date: "2026-06-20", description: "Globex Inc — Partial Payment",    type: "income",   category: "Recruitment",    amount: 47500,  currency: "SAR", status: "completed", reference: "INV-0045", clientName: "Globex Inc" },
  { id: "6",  date: "2026-06-19", description: "Cloud & Software Subscriptions",  type: "expense",  category: "Technology",     amount: 3200,   currency: "AED", status: "completed", reference: "EXP-062" },
  { id: "7",  date: "2026-06-18", description: "INV-0045 — Pinnacle Corp",        type: "income",   category: "Recruitment",    amount: 9900,   currency: "BHD", status: "pending",   reference: "INV-0045", clientName: "Pinnacle Corp" },
  { id: "8",  date: "2026-06-17", description: "Marketing & Advertising",         type: "expense",  category: "Marketing",      amount: 8500,   currency: "AED", status: "completed", reference: "EXP-063" },
  { id: "9",  date: "2026-06-15", description: "TechStart Ltd — Advance",         type: "income",   category: "Recruitment",    amount: 265000, currency: "INR", status: "completed", reference: "QT-0022", clientName: "TechStart Ltd" },
  { id: "10", date: "2026-06-14", description: "Legal & Compliance Fees",         type: "expense",  category: "Legal",          amount: 5000,   currency: "AED", status: "completed", reference: "EXP-064" },
  { id: "11", date: "2026-06-12", description: "Visa Processing Fee Refund",      type: "refund",   category: "Operations",     amount: 1500,   currency: "AED", status: "completed", reference: "REF-021" },
  { id: "12", date: "2026-06-10", description: "Bank Transfer — Operations",      type: "transfer", category: "Finance",        amount: 50000,  currency: "AED", status: "completed", reference: "TRF-011" },
  { id: "13", date: "2026-06-08", description: "Invoice INV-0038 — Globex Inc",   type: "income",   category: "Recruitment",    amount: 172500, currency: "SAR", status: "completed", reference: "INV-0038", clientName: "Globex Inc" },
  { id: "14", date: "2026-06-05", description: "Employee Travel & Expenses",      type: "expense",  category: "Operations",     amount: 4200,   currency: "AED", status: "completed", reference: "EXP-065" },
  { id: "15", date: "2026-06-01", description: "Insurance Premium — Annual",      type: "expense",  category: "Insurance",      amount: 22000,  currency: "AED", status: "pending",   reference: "EXP-066" },
];

export const mockMonthlyData: MonthlyData[] = [
  { month: "Jan", revenue: 420000, expenses: 180000, profit: 240000 },
  { month: "Feb", revenue: 385000, expenses: 165000, profit: 220000 },
  { month: "Mar", revenue: 510000, expenses: 195000, profit: 315000 },
  { month: "Apr", revenue: 465000, expenses: 210000, profit: 255000 },
  { month: "May", revenue: 580000, expenses: 220000, profit: 360000 },
  { month: "Jun", revenue: 495000, expenses: 185000, profit: 310000 },
];

export const mockExpenseCategories: ExpenseCategory[] = [
  { label: "Payroll",     amount: 85000, color: "#6366F1", percentage: 48 },
  { label: "Operations",  amount: 16200, color: "#8B5CF6", percentage: 9  },
  { label: "Marketing",   amount: 8500,  color: "#EC4899", percentage: 5  },
  { label: "Technology",  amount: 3200,  color: "#06B6D4", percentage: 2  },
  { label: "Legal",       amount: 5000,  color: "#F59E0B", percentage: 3  },
  { label: "Insurance",   amount: 22000, color: "#EF4444", percentage: 12 },
  { label: "Other",       amount: 37500, color: "#94A3B8", percentage: 21 },
];

export const mockReceivables = [
  { client: "TechStart Ltd",  amount: 88500,  currency: "INR", overdueDays: 0,  dueDate: "2026-06-30", status: "current" as const },
  { client: "Globex Inc",     amount: 156000, currency: "SAR", overdueDays: 12, dueDate: "2026-06-08", status: "overdue" as const },
  { client: "Pinnacle Corp",  amount: 9900,   currency: "BHD", overdueDays: 0,  dueDate: "2026-07-10", status: "current" as const },
  { client: "Nexus Co",       amount: 67200,  currency: "MVR", overdueDays: 5,  dueDate: "2026-06-20", status: "overdue" as const },
];
