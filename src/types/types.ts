export type CandidateStatus = "active" | "processing" | "offered" | "new" | "expired" | "rejected" | "placed";

export type DocumentStatus = "valid" | "expiring" | "expired" | "missing";

export interface Document {
  name: string;
  status: DocumentStatus;
  expiryDate?: string;
  uploadedDate?: string;
  fileUrl?: string;
}

export interface Candidate {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  nationality: string;
  status: CandidateStatus;
  role: string;
  department: string;
  basicSalary: number;
  currency: string;
  email: string;
  phone: string;
  whatsapp?: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  maritalStatus: string;
  religion?: string;
  address: string;
  city: string;
  country: string;
  appliedDate: string;
  placedDate?: string;
  client?: string;
  experience: string;
  skills: string[];
  languages: string[];
  education: string;
  // Bank Details
  bankName?: string;
  bankAccount?: string;
  bankIFSC?: string;
  bankBranch?: string;
  // Documents
  documents: {
    passport: Document;
    visa: Document;
    workPermit: Document;
    medical: Document;
    insurance: Document;
    idCard: Document;
    contract: Document;
    photo: Document;
  };
  // Notes
  notes?: string;
  rating: number;
  source: string;
  recruiter: string;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
}

export const NATIONALITIES = ["Indian", "Filipino", "Nepali", "Kenyan", "Egyptian", "Bangladeshi", "Pakistani", "Ghanaian", "Sri Lankan", "Indonesian", "Vietnamese", "Maldivian"];
export const ROLES = ["Site Supervisor", "Steel Fixer", "Housekeeper", "Forklift Operator", "Security Guard", "Electrician", "Chef", "Cleaner", "Plumber", "Mason", "Carpenter", "Driver", "Painter", "Welder", "Mechanic", "IT Technician"];
export const DEPARTMENTS = ["Construction", "Hospitality", "Security", "Technical", "Logistics", "Administration", "Healthcare", "Maintenance"];
export const SOURCES = ["Direct Application", "Referral", "Agency", "Job Portal", "LinkedIn", "Walk-in"];

export const mockCandidates: Candidate[] = [
  {
    id: "1", code: "CN-2000", firstName: "Arjun", lastName: "Kumar", nationality: "Indian",
    status: "active", role: "Site Supervisor", department: "Construction",
    basicSalary: 1500, currency: "MVR", email: "arjun.kumar@email.com", phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210", dateOfBirth: "1990-03-15", gender: "Male", maritalStatus: "Married",
    address: "123 Main St", city: "Mumbai", country: "India", appliedDate: "2024-01-10",
    placedDate: "2024-02-01", client: "Acme Corp", experience: "8 years",
    skills: ["Project Management", "AutoCAD", "Team Leadership"], languages: ["Hindi", "English"],
    education: "B.Tech Civil Engineering", bankName: "HDFC Bank",
    bankAccount: "123456789012", bankIFSC: "HDFC0001234", bankBranch: "Andheri West",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2028-03-15", uploadedDate: "2024-01-10" },
      visa: { name: "Visa", status: "valid", expiryDate: "2025-12-31", uploadedDate: "2024-01-15" },
      workPermit: { name: "Work Permit", status: "expiring", expiryDate: "2024-08-01", uploadedDate: "2024-01-15" },
      medical: { name: "Medical", status: "expiring", expiryDate: "2024-07-20", uploadedDate: "2024-01-12" },
      insurance: { name: "Insurance", status: "expired", expiryDate: "2024-05-01", uploadedDate: "2024-01-12" },
      idCard: { name: "ID Card", status: "valid", expiryDate: "2027-01-01", uploadedDate: "2024-01-10" },
      contract: { name: "Contract", status: "valid", uploadedDate: "2024-02-01" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2024-01-10" },
    },
    notes: "Excellent performer. Promoted to lead supervisor.", rating: 4.5, source: "Referral",
    recruiter: "Priya S.", allowances: [{ name: "Housing", amount: 300 }, { name: "Transport", amount: 150 }],
    deductions: [{ name: "Tax", amount: 120 }, { name: "PF", amount: 75 }],
  },
  {
    id: "2", code: "CN-2001", firstName: "Mary", lastName: "Grace", nationality: "Filipino",
    status: "active", role: "Steel Fixer", department: "Construction",
    basicSalary: 1850, currency: "MVR", email: "mary.grace@email.com", phone: "+63 917 1234567",
    dateOfBirth: "1992-07-22", gender: "Female", maritalStatus: "Single",
    address: "45 Rizal Ave", city: "Manila", country: "Philippines", appliedDate: "2024-02-05",
    placedDate: "2024-03-01", client: "TechStart Ltd", experience: "5 years",
    skills: ["Steel Fixing", "Blueprint Reading"], languages: ["Filipino", "English"],
    education: "Vocational Training - Construction",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2027-07-22", uploadedDate: "2024-02-05" },
      visa: { name: "Visa", status: "valid", expiryDate: "2025-10-31", uploadedDate: "2024-02-10" },
      workPermit: { name: "Work Permit", status: "expiring", expiryDate: "2024-08-15", uploadedDate: "2024-02-10" },
      medical: { name: "Medical", status: "expiring", expiryDate: "2024-07-30", uploadedDate: "2024-02-08" },
      insurance: { name: "Insurance", status: "expiring", expiryDate: "2024-07-30", uploadedDate: "2024-02-08" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2024-02-05" },
      contract: { name: "Contract", status: "valid", uploadedDate: "2024-03-01" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2024-02-05" },
    },
    notes: "", rating: 4.0, source: "Agency",
    recruiter: "Karan M.", allowances: [{ name: "Housing", amount: 350 }],
    deductions: [{ name: "Tax", amount: 148 }],
  },
  {
    id: "3", code: "CN-2002", firstName: "Bishnu", lastName: "Thapa", nationality: "Nepali",
    status: "active", role: "Housekeeper", department: "Hospitality",
    basicSalary: 2200, currency: "MVR", email: "bishnu.thapa@email.com", phone: "+977 980 1234567",
    dateOfBirth: "1988-11-05", gender: "Male", maritalStatus: "Married",
    address: "78 Thamel", city: "Kathmandu", country: "Nepal", appliedDate: "2024-01-20",
    placedDate: "2024-02-15", client: "Globex Inc", experience: "10 years",
    skills: ["Housekeeping", "Laundry", "Room Service"], languages: ["Nepali", "Hindi", "English"],
    education: "Secondary Education",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2029-11-05", uploadedDate: "2024-01-20" },
      visa: { name: "Visa", status: "valid", expiryDate: "2026-02-15", uploadedDate: "2024-01-25" },
      workPermit: { name: "Work Permit", status: "expiring", expiryDate: "2024-07-15", uploadedDate: "2024-01-25" },
      medical: { name: "Medical", status: "expiring", expiryDate: "2024-08-05", uploadedDate: "2024-01-22" },
      insurance: { name: "Insurance", status: "expiring", expiryDate: "2024-08-05", uploadedDate: "2024-01-22" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2024-01-20" },
      contract: { name: "Contract", status: "valid", uploadedDate: "2024-02-15" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2024-01-20" },
    },
    notes: "Very reliable. Long-term placement.", rating: 4.8, source: "Direct Application",
    recruiter: "Sneha P.", allowances: [{ name: "Food", amount: 200 }, { name: "Transport", amount: 100 }],
    deductions: [{ name: "Tax", amount: 176 }],
  },
  {
    id: "4", code: "CN-2003", firstName: "John", lastName: "Mwangi", nationality: "Kenyan",
    status: "processing", role: "Forklift Operator", department: "Logistics",
    basicSalary: 2550, currency: "MVR", email: "john.mwangi@email.com", phone: "+254 712 345678",
    dateOfBirth: "1991-04-18", gender: "Male", maritalStatus: "Single",
    address: "22 Kenyatta Ave", city: "Nairobi", country: "Kenya", appliedDate: "2024-04-01",
    experience: "6 years", skills: ["Forklift", "Warehouse Management", "Safety"], languages: ["Swahili", "English"],
    education: "Diploma in Logistics",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2028-04-18", uploadedDate: "2024-04-01" },
      visa: { name: "Visa", status: "missing" },
      workPermit: { name: "Work Permit", status: "missing" },
      medical: { name: "Medical", status: "missing" },
      insurance: { name: "Insurance", status: "missing" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2024-04-01" },
      contract: { name: "Contract", status: "missing" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2024-04-01" },
    },
    notes: "In documentation process.", rating: 3.8, source: "Job Portal",
    recruiter: "Rohan M.", allowances: [], deductions: [],
  },
  {
    id: "5", code: "CN-2004", firstName: "Omar", lastName: "Said", nationality: "Egyptian",
    status: "offered", role: "Security Guard", department: "Security",
    basicSalary: 2900, currency: "MVR", email: "omar.said@email.com", phone: "+20 100 1234567",
    dateOfBirth: "1985-09-12", gender: "Male", maritalStatus: "Married",
    address: "5 Cairo St", city: "Cairo", country: "Egypt", appliedDate: "2024-03-15",
    experience: "12 years", skills: ["Security", "CCTV", "First Aid"], languages: ["Arabic", "English"],
    education: "Military Academy Graduate", client: "Nexus Co",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2027-09-12", uploadedDate: "2024-03-15" },
      visa: { name: "Visa", status: "valid", expiryDate: "2025-09-12", uploadedDate: "2024-03-20" },
      workPermit: { name: "Work Permit", status: "expiring", expiryDate: "2024-07-01", uploadedDate: "2024-03-20" },
      medical: { name: "Medical", status: "valid", expiryDate: "2025-03-15", uploadedDate: "2024-03-18" },
      insurance: { name: "Insurance", status: "expiring", expiryDate: "2024-07-01", uploadedDate: "2024-03-18" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2024-03-15" },
      contract: { name: "Contract", status: "missing" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2024-03-15" },
    },
    notes: "Offer sent. Awaiting acceptance.", rating: 4.2, source: "Referral",
    recruiter: "Priya S.", allowances: [{ name: "Housing", amount: 400 }],
    deductions: [{ name: "Tax", amount: 232 }],
  },
  {
    id: "6", code: "CN-2005", firstName: "Karim", lastName: "Rahman", nationality: "Bangladeshi",
    status: "new", role: "Electrician", department: "Technical",
    basicSalary: 3250, currency: "MVR", email: "karim.rahman@email.com", phone: "+880 17 12345678",
    dateOfBirth: "1993-12-30", gender: "Male", maritalStatus: "Single",
    address: "10 Dhaka Rd", city: "Dhaka", country: "Bangladesh", appliedDate: "2024-05-20",
    experience: "7 years", skills: ["Electrical Wiring", "Panel Installation", "Troubleshooting"], languages: ["Bengali", "English"],
    education: "Diploma in Electrical Engineering",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2028-12-30", uploadedDate: "2024-05-20" },
      visa: { name: "Visa", status: "missing" },
      workPermit: { name: "Work Permit", status: "missing" },
      medical: { name: "Medical", status: "missing" },
      insurance: { name: "Insurance", status: "missing" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2024-05-20" },
      contract: { name: "Contract", status: "missing" },
      photo: { name: "Photo", status: "missing" },
    },
    notes: "Fresh application. Screening pending.", rating: 0, source: "Walk-in",
    recruiter: "Karan M.", allowances: [], deductions: [],
  },
  {
    id: "7", code: "CN-2006", firstName: "Wei", lastName: "Chen", nationality: "Pakistani",
    status: "active", role: "Chef", department: "Hospitality",
    basicSalary: 1500, currency: "MVR", email: "wei.chen@email.com", phone: "+92 300 1234567",
    dateOfBirth: "1987-06-08", gender: "Male", maritalStatus: "Married",
    address: "33 Lahore St", city: "Lahore", country: "Pakistan", appliedDate: "2023-11-01",
    placedDate: "2023-12-01", client: "BrightWave", experience: "15 years",
    skills: ["Continental Cuisine", "Kitchen Management", "HACCP"], languages: ["Urdu", "English"],
    education: "Culinary Arts Diploma",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2027-06-08", uploadedDate: "2023-11-01" },
      visa: { name: "Visa", status: "valid", expiryDate: "2025-11-30", uploadedDate: "2023-11-10" },
      workPermit: { name: "Work Permit", status: "valid", expiryDate: "2025-11-30", uploadedDate: "2023-11-10" },
      medical: { name: "Medical", status: "valid", expiryDate: "2025-06-08", uploadedDate: "2023-11-05" },
      insurance: { name: "Insurance", status: "valid", expiryDate: "2025-06-08", uploadedDate: "2023-11-05" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2023-11-01" },
      contract: { name: "Contract", status: "valid", uploadedDate: "2023-12-01" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2023-11-01" },
    },
    notes: "Top performer. Client highly satisfied.", rating: 5.0, source: "Agency",
    recruiter: "Sneha P.", allowances: [{ name: "Meals", amount: 250 }],
    deductions: [{ name: "Tax", amount: 120 }],
  },
  {
    id: "8", code: "CN-2007", firstName: "Kwame", lastName: "Mensah", nationality: "Ghanaian",
    status: "expired", role: "Cleaner", department: "Hospitality",
    basicSalary: 1850, currency: "MVR", email: "kwame.mensah@email.com", phone: "+233 24 1234567",
    dateOfBirth: "1995-02-14", gender: "Male", maritalStatus: "Single",
    address: "7 Accra Rd", city: "Accra", country: "Ghana", appliedDate: "2023-06-01",
    experience: "3 years", skills: ["Cleaning", "Sanitation"], languages: ["Twi", "English"],
    education: "Secondary Education",
    documents: {
      passport: { name: "Passport", status: "expired", expiryDate: "2024-02-14", uploadedDate: "2023-06-01" },
      visa: { name: "Visa", status: "expired", expiryDate: "2024-01-01", uploadedDate: "2023-06-10" },
      workPermit: { name: "Work Permit", status: "expired", expiryDate: "2024-01-01", uploadedDate: "2023-06-10" },
      medical: { name: "Medical", status: "expired", expiryDate: "2024-02-01", uploadedDate: "2023-06-08" },
      insurance: { name: "Insurance", status: "expired", expiryDate: "2024-01-01", uploadedDate: "2023-06-08" },
      idCard: { name: "ID Card", status: "expired", uploadedDate: "2023-06-01" },
      contract: { name: "Contract", status: "expired", uploadedDate: "2023-06-15" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2023-06-01" },
    },
    notes: "Documents expired. Renewal required.", rating: 3.0, source: "Direct Application",
    recruiter: "Rohan M.", allowances: [], deductions: [],
  },
  {
    id: "9", code: "CN-2008", firstName: "Sunil", lastName: "Patel", nationality: "Indian",
    status: "active", role: "Site Supervisor", department: "Construction",
    basicSalary: 2200, currency: "MVR", email: "sunil.patel@email.com", phone: "+91 87654 32109",
    dateOfBirth: "1986-08-25", gender: "Male", maritalStatus: "Married",
    address: "88 Gandhi Nagar", city: "Ahmedabad", country: "India", appliedDate: "2024-01-05",
    placedDate: "2024-01-25", client: "Acme Corp", experience: "12 years",
    skills: ["Site Management", "Safety Compliance", "Quality Control"], languages: ["Gujarati", "Hindi", "English"],
    education: "B.E. Civil Engineering", bankName: "SBI",
    bankAccount: "98765432101", bankIFSC: "SBIN0001234", bankBranch: "Navrangpura",
    documents: {
      passport: { name: "Passport", status: "valid", expiryDate: "2028-08-25", uploadedDate: "2024-01-05" },
      visa: { name: "Visa", status: "valid", expiryDate: "2026-01-25", uploadedDate: "2024-01-10" },
      workPermit: { name: "Work Permit", status: "valid", expiryDate: "2026-01-25", uploadedDate: "2024-01-10" },
      medical: { name: "Medical", status: "valid", expiryDate: "2025-08-25", uploadedDate: "2024-01-08" },
      insurance: { name: "Insurance", status: "valid", expiryDate: "2025-08-25", uploadedDate: "2024-01-08" },
      idCard: { name: "ID Card", status: "valid", uploadedDate: "2024-01-05" },
      contract: { name: "Contract", status: "valid", uploadedDate: "2024-01-25" },
      photo: { name: "Photo", status: "valid", uploadedDate: "2024-01-05" },
    },
    notes: "Senior supervisor. Handling 3 sites.", rating: 4.7, source: "Referral",
    recruiter: "Priya S.", allowances: [{ name: "Housing", amount: 400 }, { name: "Transport", amount: 200 }],
    deductions: [{ name: "Tax", amount: 176 }, { name: "PF", amount: 110 }],
  },
];