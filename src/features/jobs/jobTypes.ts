export type JobStatus = "open" | "in_progress" | "interviewing" | "offer_stage" | "filled" | "on_hold" | "cancelled";
export type JobType = "permanent" | "contract" | "temporary" | "freelance";
export type JobPriority = "urgent" | "high" | "medium" | "low";

export interface Job {
  id: string;
  jobCode: string;
  title: string;
  clientId: string;
  clientName: string;
  department: string;
  location: string;
  country: string;
  jobType: JobType;
  status: JobStatus;
  priority: JobPriority;
  vacancies: number;
  filledVacancies: number;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  assignedTo: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string;
  applications: number;
  interviews: number;
  offers: number;
  tags: string[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; order: number }> = {
  open:         { label: "Open",         color: "#6366F1", bg: "rgba(99,102,241,0.10)",  order: 0 },
  in_progress:  { label: "In Progress",  color: "#06B6D4", bg: "rgba(6,182,212,0.10)",   order: 1 },
  interviewing: { label: "Interviewing", color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  order: 2 },
  offer_stage:  { label: "Offer Stage",  color: "#8B5CF6", bg: "rgba(139,92,246,0.10)",  order: 3 },
  filled:       { label: "Filled",       color: "#10B981", bg: "rgba(16,185,129,0.10)",  order: 4 },
  on_hold:      { label: "On Hold",      color: "#94A3B8", bg: "rgba(148,163,184,0.10)", order: 5 },
  cancelled:    { label: "Cancelled",    color: "#EF4444", bg: "rgba(239,68,68,0.10)",   order: 6 },
};

export const PRIORITY_CONFIG: Record<JobPriority, { label: string; color: string; bg: string; dot: string }> = {
  urgent: { label: "Urgent", color: "#EF4444", bg: "rgba(239,68,68,0.10)",   dot: "#EF4444" },
  high:   { label: "High",   color: "#F97316", bg: "rgba(249,115,22,0.10)",  dot: "#F97316" },
  medium: { label: "Medium", color: "#F59E0B", bg: "rgba(245,158,11,0.10)",  dot: "#F59E0B" },
  low:    { label: "Low",    color: "#10B981", bg: "rgba(16,185,129,0.10)",  dot: "#10B981" },
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  permanent:  "Permanent",
  contract:   "Contract",
  temporary:  "Temporary",
  freelance:  "Freelance",
};

export const KANBAN_COLUMNS: JobStatus[] = ["open", "in_progress", "interviewing", "offer_stage", "filled"];

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockJobs: Job[] = [
  {
    id: "1", jobCode: "JO-1001", title: "Senior Civil Engineer", clientId: "1", clientName: "Acme Corp",
    department: "Engineering", location: "Dubai", country: "UAE", jobType: "permanent",
    status: "interviewing", priority: "urgent", vacancies: 3, filledVacancies: 1,
    salaryMin: 18000, salaryMax: 25000, currency: "AED", assignedTo: "Arjun Kumar",
    postedDate: "2026-06-01", deadline: "2026-07-01",
    description: "We are seeking experienced Senior Civil Engineers to lead construction projects across the UAE. The role involves overseeing site operations, ensuring quality standards, and coordinating with project management teams.",
    requirements: "5+ years civil engineering experience\nBEng/MEng in Civil Engineering\nUAE driving license preferred\nExperience with high-rise construction",
    applications: 42, interviews: 8, offers: 2,
    tags: ["Civil Engineering", "Construction", "UAE", "Senior Level"],
  },
  {
    id: "2", jobCode: "JO-1002", title: "React Developer", clientId: "2", clientName: "TechStart Ltd",
    department: "Engineering", location: "Bangalore", country: "India", jobType: "contract",
    status: "in_progress", priority: "high", vacancies: 2, filledVacancies: 0,
    salaryMin: 80000, salaryMax: 120000, currency: "INR", assignedTo: "Priya Menon",
    postedDate: "2026-06-10", deadline: "2026-06-30",
    description: "TechStart Ltd requires experienced React Developers to join their product team on a 6-month contract. You will work on building scalable web applications using React, TypeScript, and GraphQL.",
    requirements: "3+ years React.js experience\nTypeScript proficiency\nGraphQL/REST APIs\nRemote-friendly role",
    applications: 28, interviews: 5, offers: 1,
    tags: ["React", "TypeScript", "Frontend", "Contract"],
  },
  {
    id: "3", jobCode: "JO-1003", title: "Field Technicians (Batch)", clientId: "3", clientName: "Globex Inc",
    department: "Operations", location: "Riyadh", country: "Saudi Arabia", jobType: "contract",
    status: "offer_stage", priority: "urgent", vacancies: 8, filledVacancies: 5,
    salaryMin: 8000, salaryMax: 12000, currency: "SAR", assignedTo: "Arjun Kumar",
    postedDate: "2026-05-15", deadline: "2026-06-15",
    description: "Globex Inc requires a batch of qualified Field Technicians for oil & gas operations in Riyadh. Immediate joining preferred. Accommodation and meals provided on-site.",
    requirements: "Diploma/ITI in relevant field\nOil & Gas experience\nReady to relocate\nAramco clearance preferred",
    applications: 156, interviews: 22, offers: 7,
    tags: ["Oil & Gas", "Technician", "Saudi Arabia", "Batch Hire"],
  },
  {
    id: "4", jobCode: "JO-1004", title: "Hospitality Staff (F&B)", clientId: "4", clientName: "Nexus Co",
    department: "Hospitality", location: "Malé", country: "Maldives", jobType: "permanent",
    status: "open", priority: "medium", vacancies: 5, filledVacancies: 0,
    salaryMin: 12000, salaryMax: 18000, currency: "MVR", assignedTo: "Rahul Sharma",
    postedDate: "2026-06-18", deadline: "2026-07-18",
    description: "Nexus Co is looking for experienced F&B staff for their luxury resort properties in the Maldives. Role includes waitstaff, bartenders, and kitchen assistants.",
    requirements: "2+ years hospitality experience\nExcellent communication skills\nWilling to work in island resort\nFood safety certification",
    applications: 19, interviews: 0, offers: 0,
    tags: ["Hospitality", "F&B", "Maldives", "Resort"],
  },
  {
    id: "5", jobCode: "JO-1005", title: "Property Manager", clientId: "8", clientName: "Pinnacle Corp",
    department: "Real Estate", location: "Manama", country: "Bahrain", jobType: "permanent",
    status: "in_progress", priority: "medium", vacancies: 2, filledVacancies: 0,
    salaryMin: 3000, salaryMax: 4500, currency: "BHD", assignedTo: "Priya Menon",
    postedDate: "2026-06-12", deadline: "2026-07-12",
    description: "Pinnacle Corp seeks experienced Property Managers to oversee their premium residential and commercial portfolio in Bahrain's Seef District.",
    requirements: "3+ years property management\nReal estate license (preferred)\nFluent English & Arabic\nStrong negotiation skills",
    applications: 14, interviews: 3, offers: 0,
    tags: ["Real Estate", "Management", "Bahrain"],
  },
  {
    id: "6", jobCode: "JO-1006", title: "Manufacturing Operators", clientId: "5", clientName: "BrightWave",
    department: "Manufacturing", location: "Muscat", country: "Oman", jobType: "contract",
    status: "filled", priority: "low", vacancies: 6, filledVacancies: 6,
    salaryMin: 1800, salaryMax: 2800, currency: "OMR", assignedTo: "Arjun Kumar",
    postedDate: "2026-05-01", deadline: "2026-06-01",
    description: "Filled successfully. All 6 manufacturing operator positions have been placed and started.",
    requirements: "ITI certification\nManufacturing experience\nReady to relocate to Oman",
    applications: 88, interviews: 14, offers: 6,
    tags: ["Manufacturing", "Oman", "Completed"],
  },
  {
    id: "7", jobCode: "JO-1007", title: "Telecom Network Engineer", clientId: "6", clientName: "Orion Systems",
    department: "Telecom", location: "Kuwait City", country: "Kuwait", jobType: "permanent",
    status: "on_hold", priority: "low", vacancies: 4, filledVacancies: 0,
    salaryMin: 4500, salaryMax: 7000, currency: "KWD", assignedTo: "Rahul Sharma",
    postedDate: "2026-06-05", deadline: "2026-08-05",
    description: "On hold pending client budget approval. Position will be reactivated Q3 2026.",
    requirements: "Network engineering degree\nCCNA/CCNP certification\nTelecom infrastructure experience",
    applications: 7, interviews: 0, offers: 0,
    tags: ["Telecom", "Network", "Kuwait", "On Hold"],
  },
  {
    id: "8", jobCode: "JO-1008", title: "Structural Engineer", clientId: "1", clientName: "Acme Corp",
    department: "Engineering", location: "Abu Dhabi", country: "UAE", jobType: "permanent",
    status: "open", priority: "high", vacancies: 2, filledVacancies: 0,
    salaryMin: 20000, salaryMax: 28000, currency: "AED", assignedTo: "Sneha Iyer",
    postedDate: "2026-06-22", deadline: "2026-07-22",
    description: "Acme Corp requires Structural Engineers for their Abu Dhabi infrastructure projects. Immediate joining for shortlisted candidates.",
    requirements: "BEng Structural Engineering\n5+ years experience\nAutoCAD & STAAD Pro\nUAE experience preferred",
    applications: 11, interviews: 2, offers: 0,
    tags: ["Structural", "Engineering", "Abu Dhabi"],
  },
];
