export type PerformancePeriod = "this_month" | "last_month" | "this_quarter" | "this_year";

export interface RecruiterMetric {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatar_color: string;
  placements: number;
  target_placements: number;
  revenue: number;
  target_revenue: number;
  time_to_fill: number; // avg days
  interviews_conducted: number;
  offers_made: number;
  offers_accepted: number;
  active_requisitions: number;
  candidate_quality_score: number; // 1-100
  client_satisfaction: number; // 1-100
}

export interface PipelineStage {
  label: string;
  count: number;
  color: string;
}

export interface KPITrend {
  label: string;
  current: number;
  previous: number;
  unit: string;
}

export interface PlacementByIndustry {
  industry: string;
  placements: number;
  color: string;
}

export interface TimeToFillData {
  label: string;
  days: number;
  target: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const recruiterMetrics: RecruiterMetric[] = [
  {
    id: "1", name: "Arjun Kumar", initials: "AK", role: "Senior Recruiter", avatar_color: "#6366F1",
    placements: 28, target_placements: 30, revenue: 1850000, target_revenue: 2000000,
    time_to_fill: 18, interviews_conducted: 142, offers_made: 38, offers_accepted: 32,
    active_requisitions: 12, candidate_quality_score: 88, client_satisfaction: 92,
  },
  {
    id: "2", name: "Priya Menon", initials: "PM", role: "Recruiter", avatar_color: "#8B5CF6",
    placements: 21, target_placements: 25, revenue: 1420000, target_revenue: 1500000,
    time_to_fill: 22, interviews_conducted: 108, offers_made: 29, offers_accepted: 24,
    active_requisitions: 9, candidate_quality_score: 82, client_satisfaction: 88,
  },
  {
    id: "3", name: "Rahul Sharma", initials: "RS", role: "Recruiter", avatar_color: "#10B981",
    placements: 16, target_placements: 20, revenue: 980000, target_revenue: 1200000,
    time_to_fill: 26, interviews_conducted: 84, offers_made: 22, offers_accepted: 18,
    active_requisitions: 7, candidate_quality_score: 75, client_satisfaction: 80,
  },
  {
    id: "4", name: "Sneha Iyer", initials: "SI", role: "Junior Recruiter", avatar_color: "#F59E0B",
    placements: 9, target_placements: 12, revenue: 520000, target_revenue: 700000,
    time_to_fill: 30, interviews_conducted: 55, offers_made: 13, offers_accepted: 10,
    active_requisitions: 5, candidate_quality_score: 70, client_satisfaction: 76,
  },
];

export const pipelineStages: PipelineStage[] = [
  { label: "New Applications",  count: 184, color: "#6366F1" },
  { label: "Screening",         count: 97,  color: "#8B5CF6" },
  { label: "Shortlisted",       count: 62,  color: "#06B6D4" },
  { label: "Interviews",        count: 38,  color: "#F59E0B" },
  { label: "Offer Stage",       count: 14,  color: "#EC4899" },
  { label: "Placed",            count: 9,   color: "#10B981" },
];

export const kpiTrends: KPITrend[] = [
  { label: "Total Placements",    current: 74,   previous: 62,   unit: ""    },
  { label: "Avg Time to Fill",    current: 22,   previous: 26,   unit: " d"  },
  { label: "Offer Acceptance",    current: 84,   previous: 78,   unit: "%"   },
  { label: "Client Satisfaction", current: 84,   previous: 81,   unit: "%"   },
];

export const placementsByIndustry: PlacementByIndustry[] = [
  { industry: "Construction",  placements: 32, color: "#6366F1" },
  { industry: "IT & Software", placements: 18, color: "#8B5CF6" },
  { industry: "Oil & Gas",     placements: 14, color: "#F59E0B" },
  { industry: "Hospitality",   placements: 9,  color: "#10B981" },
  { industry: "Manufacturing", placements: 8,  color: "#06B6D4" },
  { industry: "Other",         placements: 7,  color: "#94A3B8" },
];

export const timeToFillData: TimeToFillData[] = [
  { label: "Jan", days: 28, target: 25 },
  { label: "Feb", days: 25, target: 25 },
  { label: "Mar", days: 22, target: 25 },
  { label: "Apr", days: 24, target: 25 },
  { label: "May", days: 20, target: 25 },
  { label: "Jun", days: 22, target: 25 },
];

export const PERIOD_LABELS: Record<PerformancePeriod, string> = {
  this_month:    "This Month",
  last_month:    "Last Month",
  this_quarter:  "This Quarter",
  this_year:     "This Year",
};
