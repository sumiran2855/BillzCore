// ─── Types ────────────────────────────────────────────────────────────────────

export type ClientStatus = "active" | "inactive" | "prospect" | "onboarding" | "churned";

export interface ClientContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Client {
  id: string;
  code: string;
  companyName: string;
  industry: string;
  country: string;
  city: string;
  address: string;
  website?: string;
  status: ClientStatus;
  // Primary contact
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  // Business
  totalRevenue: number;
  currency: string;
  openInvoices: number;
  totalDeals: number;
  activeCandidates: number;
  contractStart: string;
  contractEnd?: string;
  // Internal
  accountManager: string;
  notes?: string;
  registeredDate: string;
  // Additional contacts
  contacts?: ClientContact[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const INDUSTRIES = [
  "Construction", "IT & Software", "Healthcare", "Manufacturing",
  "Oil & Gas", "Hospitality", "Retail", "Finance", "Logistics",
  "Education", "Real Estate", "Telecom", "Agriculture", "Other",
];

export const CLIENT_SOURCES = [
  "Referral", "Cold Outreach", "LinkedIn", "Website", "Event",
  "Partner", "Existing Relationship", "Other",
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockClients: Client[] = [
  {
    id: "1",
    code: "CL-1001",
    companyName: "Acme Corp",
    industry: "Construction",
    country: "UAE",
    city: "Dubai",
    address: "Level 12, Dubai Trade Centre, Sheikh Zayed Road",
    website: "https://acmecorp.ae",
    status: "active",
    contactName: "Ravi Nair",
    contactRole: "HR Director",
    contactEmail: "ravi@acmecorp.ae",
    contactPhone: "+971-50-123-4567",
    totalRevenue: 840000,
    currency: "AED",
    openInvoices: 3,
    totalDeals: 12,
    activeCandidates: 18,
    contractStart: "2023-01-15",
    accountManager: "Arjun Kumar",
    notes: "Key client. Requires monthly reporting. Prefers bank transfer for payments.",
    registeredDate: "2023-01-10",
    contacts: [
      { name: "Priya Shah", role: "Procurement Head", email: "priya@acmecorp.ae", phone: "+971-50-234-5678" },
      { name: "Sameer Iyer", role: "Finance Manager", email: "sameer@acmecorp.ae", phone: "+971-50-345-6789" },
    ],
  },
  {
    id: "2",
    code: "CL-1002",
    companyName: "TechStart Ltd",
    industry: "IT & Software",
    country: "India",
    city: "Bangalore",
    address: "Prestige Tech Park, Outer Ring Road",
    website: "https://techstart.in",
    status: "active",
    contactName: "Ananya Reddy",
    contactRole: "Talent Acquisition Lead",
    contactEmail: "ananya@techstart.in",
    contactPhone: "+91-98765-43210",
    totalRevenue: 610000,
    currency: "INR",
    openInvoices: 2,
    totalDeals: 9,
    activeCandidates: 11,
    contractStart: "2023-04-01",
    accountManager: "Arjun Kumar",
    notes: "Fast-growing startup. Quarterly invoicing agreed.",
    registeredDate: "2023-03-25",
    contacts: [
      { name: "Kiran Menon", role: "CTO", email: "kiran@techstart.in", phone: "+91-98765-11111" },
    ],
  },
  {
    id: "3",
    code: "CL-1003",
    companyName: "Globex Inc",
    industry: "Oil & Gas",
    country: "Saudi Arabia",
    city: "Riyadh",
    address: "King Fahd Road, Al Olaya District",
    status: "active",
    contactName: "Fahad Al-Rashid",
    contactRole: "Operations Manager",
    contactEmail: "fahad@globex.sa",
    contactPhone: "+966-55-987-6543",
    totalRevenue: 580000,
    currency: "SAR",
    openInvoices: 5,
    totalDeals: 7,
    activeCandidates: 24,
    contractStart: "2022-11-01",
    accountManager: "Arjun Kumar",
    notes: "Large workforce requirement. Ongoing visa processing delays.",
    registeredDate: "2022-10-20",
  },
  {
    id: "4",
    code: "CL-1004",
    companyName: "Nexus Co",
    industry: "Hospitality",
    country: "Maldives",
    city: "Malé",
    address: "H. Moodhuvali, Fareedhee Magu",
    website: "https://nexusco.mv",
    status: "active",
    contactName: "Ibrahim Hassan",
    contactRole: "GM - Human Resources",
    contactEmail: "ibrahim@nexusco.mv",
    contactPhone: "+960-300-1234",
    totalRevenue: 420000,
    currency: "MVR",
    openInvoices: 1,
    totalDeals: 6,
    activeCandidates: 8,
    contractStart: "2023-07-01",
    contractEnd: "2026-06-30",
    accountManager: "Arjun Kumar",
    registeredDate: "2023-06-15",
  },
  {
    id: "5",
    code: "CL-1005",
    companyName: "BrightWave",
    industry: "Manufacturing",
    country: "Oman",
    city: "Muscat",
    address: "Ghala Industrial Area, Muscat",
    status: "onboarding",
    contactName: "Layla Al-Balushi",
    contactRole: "HR Manager",
    contactEmail: "layla@brightwave.om",
    contactPhone: "+968-9876-5432",
    totalRevenue: 390000,
    currency: "OMR",
    openInvoices: 0,
    totalDeals: 5,
    activeCandidates: 6,
    contractStart: "2024-01-01",
    accountManager: "Arjun Kumar",
    notes: "New client — onboarding in progress. Initial 5 placements agreed.",
    registeredDate: "2023-12-10",
  },
  {
    id: "6",
    code: "CL-1006",
    companyName: "Orion Systems",
    industry: "Telecom",
    country: "Kuwait",
    city: "Kuwait City",
    address: "Salmiya, Block 12, Kuwait",
    status: "prospect",
    contactName: "Nasser Al-Mutairi",
    contactRole: "Director of HR",
    contactEmail: "nasser@orionsys.kw",
    contactPhone: "+965-9000-1111",
    totalRevenue: 0,
    currency: "KWD",
    openInvoices: 0,
    totalDeals: 0,
    activeCandidates: 0,
    contractStart: "2024-07-01",
    accountManager: "Arjun Kumar",
    notes: "Prospect — proposal sent June 2024. Follow up pending.",
    registeredDate: "2024-05-20",
  },
  {
    id: "7",
    code: "CL-1007",
    companyName: "ZenTech Pvt",
    industry: "IT & Software",
    country: "India",
    city: "Chennai",
    address: "DLF IT Park, Manapakkam, Chennai",
    status: "inactive",
    contactName: "Deepa Krishnamurthy",
    contactRole: "HR Head",
    contactEmail: "deepa@zentech.in",
    contactPhone: "+91-44-1234-5678",
    totalRevenue: 98000,
    currency: "INR",
    openInvoices: 2,
    totalDeals: 3,
    activeCandidates: 0,
    contractStart: "2022-05-01",
    contractEnd: "2023-04-30",
    accountManager: "Arjun Kumar",
    notes: "Contract ended. Overdue invoices pending collection.",
    registeredDate: "2022-04-15",
  },
  {
    id: "8",
    code: "CL-1008",
    companyName: "Pinnacle Corp",
    industry: "Real Estate",
    country: "Bahrain",
    city: "Manama",
    address: "Seef District, Block 346, Manama",
    status: "active",
    contactName: "Sara Al-Khalifa",
    contactRole: "Head of Talent",
    contactEmail: "sara@pinnacle.bh",
    contactPhone: "+973-3900-8888",
    totalRevenue: 545000,
    currency: "BHD",
    openInvoices: 1,
    totalDeals: 8,
    activeCandidates: 14,
    contractStart: "2023-09-01",
    accountManager: "Arjun Kumar",
    registeredDate: "2023-08-20",
  },
];
