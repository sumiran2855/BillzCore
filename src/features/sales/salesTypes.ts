export type Period = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface SalesDataPoint {
  label: string;
  revenue: number;
  deals: number;
  placements: number;
  target: number;
}

export interface TopClient {
  name: string;
  revenue: number;
  deals: number;
  currency: string;
  growth: number; // % change vs prior period
}

export interface TopManager {
  name: string;
  revenue: number;
  deals: number;
  closingRate: number;
}

export interface SalesDeal {
  id: string;
  date: string;
  client: string;
  description: string;
  value: number;
  currency: string;
  placements: number;
  manager: string;
  status: "won" | "lost" | "open";
}

// ─── Daily (last 14 days) ─────────────────────────────────────────────────────
export const dailyData: SalesDataPoint[] = [
  { label: "Jun 12", revenue: 18500,  deals: 1, placements: 2,  target: 20000 },
  { label: "Jun 13", revenue: 0,      deals: 0, placements: 0,  target: 20000 },
  { label: "Jun 14", revenue: 32000,  deals: 2, placements: 3,  target: 20000 },
  { label: "Jun 15", revenue: 11000,  deals: 1, placements: 1,  target: 20000 },
  { label: "Jun 16", revenue: 27500,  deals: 2, placements: 4,  target: 20000 },
  { label: "Jun 17", revenue: 0,      deals: 0, placements: 0,  target: 20000 },
  { label: "Jun 18", revenue: 0,      deals: 0, placements: 0,  target: 20000 },
  { label: "Jun 19", revenue: 45000,  deals: 3, placements: 5,  target: 20000 },
  { label: "Jun 20", revenue: 22000,  deals: 2, placements: 3,  target: 20000 },
  { label: "Jun 21", revenue: 8500,   deals: 1, placements: 1,  target: 20000 },
  { label: "Jun 22", revenue: 38000,  deals: 2, placements: 4,  target: 20000 },
  { label: "Jun 23", revenue: 15000,  deals: 1, placements: 2,  target: 20000 },
  { label: "Jun 24", revenue: 55000,  deals: 3, placements: 6,  target: 20000 },
  { label: "Jun 25", revenue: 29500,  deals: 2, placements: 3,  target: 20000 },
];

// ─── Weekly (last 12 weeks) ───────────────────────────────────────────────────
export const weeklyData: SalesDataPoint[] = [
  { label: "Wk 15", revenue: 82000,  deals: 5,  placements: 9,  target: 100000 },
  { label: "Wk 16", revenue: 118000, deals: 7,  placements: 12, target: 100000 },
  { label: "Wk 17", revenue: 95000,  deals: 6,  placements: 11, target: 100000 },
  { label: "Wk 18", revenue: 76000,  deals: 4,  placements: 8,  target: 100000 },
  { label: "Wk 19", revenue: 142000, deals: 9,  placements: 16, target: 100000 },
  { label: "Wk 20", revenue: 108000, deals: 7,  placements: 13, target: 100000 },
  { label: "Wk 21", revenue: 88000,  deals: 5,  placements: 10, target: 100000 },
  { label: "Wk 22", revenue: 155000, deals: 10, placements: 18, target: 100000 },
  { label: "Wk 23", revenue: 121000, deals: 8,  placements: 14, target: 100000 },
  { label: "Wk 24", revenue: 97000,  deals: 6,  placements: 11, target: 100000 },
  { label: "Wk 25", revenue: 131000, deals: 8,  placements: 15, target: 100000 },
  { label: "Wk 26", revenue: 112000, deals: 7,  placements: 13, target: 100000 },
];

// ─── Monthly (last 12 months) ─────────────────────────────────────────────────
export const monthlyData: SalesDataPoint[] = [
  { label: "Jul'25", revenue: 380000, deals: 22, placements: 38, target: 450000 },
  { label: "Aug'25", revenue: 425000, deals: 26, placements: 44, target: 450000 },
  { label: "Sep'25", revenue: 510000, deals: 31, placements: 55, target: 450000 },
  { label: "Oct'25", revenue: 465000, deals: 28, placements: 49, target: 450000 },
  { label: "Nov'25", revenue: 398000, deals: 24, placements: 41, target: 450000 },
  { label: "Dec'25", revenue: 342000, deals: 19, placements: 33, target: 450000 },
  { label: "Jan'26", revenue: 420000, deals: 25, placements: 42, target: 480000 },
  { label: "Feb'26", revenue: 385000, deals: 23, placements: 39, target: 480000 },
  { label: "Mar'26", revenue: 510000, deals: 32, placements: 56, target: 480000 },
  { label: "Apr'26", revenue: 465000, deals: 29, placements: 51, target: 480000 },
  { label: "May'26", revenue: 580000, deals: 36, placements: 63, target: 480000 },
  { label: "Jun'26", revenue: 495000, deals: 30, placements: 52, target: 480000 },
];

// ─── Quarterly ────────────────────────────────────────────────────────────────
export const quarterlyData: SalesDataPoint[] = [
  { label: "Q3 2025", revenue: 1315000, deals: 79,  placements: 137, target: 1350000 },
  { label: "Q4 2025", revenue: 1205000, deals: 71,  placements: 123, target: 1350000 },
  { label: "Q1 2026", revenue: 1315000, deals: 80,  placements: 137, target: 1440000 },
  { label: "Q2 2026", revenue: 1540000, deals: 95,  placements: 166, target: 1440000 },
];

// ─── Yearly ───────────────────────────────────────────────────────────────────
export const yearlyData: SalesDataPoint[] = [
  { label: "2022", revenue: 2800000, deals: 165, placements: 280, target: 3000000 },
  { label: "2023", revenue: 3650000, deals: 218, placements: 370, target: 3500000 },
  { label: "2024", revenue: 4200000, deals: 255, placements: 445, target: 4000000 },
  { label: "2025", revenue: 4850000, deals: 290, placements: 510, target: 4500000 },
  { label: "2026*", revenue: 2855000, deals: 175, placements: 303, target: 5000000 },
];

export const periodDataMap: Record<Period, SalesDataPoint[]> = {
  daily: dailyData, weekly: weeklyData, monthly: monthlyData,
  quarterly: quarterlyData, yearly: yearlyData,
};

export const topClients: TopClient[] = [
  { name: "Acme Corp",    revenue: 840000, deals: 12, currency: "AED", growth: 18  },
  { name: "Globex Inc",   revenue: 728500, deals: 9,  currency: "SAR", growth: 12  },
  { name: "TechStart Ltd",revenue: 615000, deals: 8,  currency: "INR", growth: 25  },
  { name: "Pinnacle Corp",revenue: 545000, deals: 7,  currency: "BHD", growth: -5  },
  { name: "Nexus Co",     revenue: 420000, deals: 6,  currency: "MVR", growth: 8   },
];

export const topManagers: TopManager[] = [
  { name: "Arjun Kumar",  revenue: 1850000, deals: 42, closingRate: 78 },
  { name: "Priya Menon",  revenue: 1420000, deals: 35, closingRate: 71 },
  { name: "Rahul Sharma", revenue: 980000,  deals: 28, closingRate: 65 },
];

export const salesDeals: SalesDeal[] = [
  { id: "1",  date: "2026-06-24", client: "Acme Corp",     description: "Civil Engineers — 5 Placements",       value: 55125,  currency: "AED", placements: 5,  manager: "Arjun Kumar",  status: "won"  },
  { id: "2",  date: "2026-06-22", client: "TechStart Ltd", description: "React Developer Recruitment",          value: 88500,  currency: "INR", placements: 1,  manager: "Priya Menon",  status: "open" },
  { id: "3",  date: "2026-06-21", client: "Globex Inc",    description: "Technicians Batch — 8 Placements",     value: 142000, currency: "SAR", placements: 8,  manager: "Arjun Kumar",  status: "won"  },
  { id: "4",  date: "2026-06-19", client: "Nexus Co",      description: "Hospitality Staff — 5 Placements",     value: 67200,  currency: "MVR", placements: 5,  manager: "Rahul Sharma", status: "won"  },
  { id: "5",  date: "2026-06-18", client: "Pinnacle Corp", description: "Property Manager — 2 Positions",       value: 9900,   currency: "BHD", placements: 2,  manager: "Priya Menon",  status: "open" },
  { id: "6",  date: "2026-06-15", client: "BrightWave",    description: "Manufacturing Operators — 6",          value: 16275,  currency: "OMR", placements: 6,  manager: "Arjun Kumar",  status: "won"  },
  { id: "7",  date: "2026-06-12", client: "Orion Systems", description: "Telecom Engineers Proposal",           value: 35200,  currency: "KWD", placements: 0,  manager: "Priya Menon",  status: "lost" },
  { id: "8",  date: "2026-06-10", client: "ZenTech Pvt",   description: "IT Staffing — Contract Renewal",       value: 98000,  currency: "INR", placements: 3,  manager: "Rahul Sharma", status: "lost" },
  { id: "9",  date: "2026-06-08", client: "Acme Corp",     description: "Site Supervisors — 2 Placements",      value: 22000,  currency: "AED", placements: 2,  manager: "Arjun Kumar",  status: "won"  },
  { id: "10", date: "2026-06-05", client: "Nexus Co",      description: "F&B Staff — 3 Placements",             value: 42000,  currency: "MVR", placements: 3,  manager: "Rahul Sharma", status: "open" },
];
