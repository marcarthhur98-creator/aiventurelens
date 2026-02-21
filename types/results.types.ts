import type { SectionId } from "./assessment.types";

export type VerdictLevel =
  | "Critical Risk"
  | "High Risk"
  | "Moderate Risk"
  | "Investment Ready"
  | "Exemplary";

export type ActionSeverity = "critical" | "high" | "medium" | "low";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  section: SectionId;
  severity: ActionSeverity;
  effort: "low" | "medium" | "high";
  impact: string;
}

export interface AnalysisResult {
  compositeScore: number; // 0–100
  sectionScores: Record<SectionId, number>;
  verdict: VerdictLevel;
  verdictRationale: string;
  executiveSummary: string;
  priorityActions: ActionItem[];
  strengths: string[];
  riskFlags: string[];
}

export type VerdictConfig = {
  label: VerdictLevel;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
};

export const VERDICT_CONFIG: Record<VerdictLevel, VerdictConfig> = {
  "Critical Risk": {
    label: "Critical Risk",
    color: "#ef4444",
    bgColor: "bg-red-950/40",
    borderColor: "border-red-700",
    textColor: "text-red-400",
  },
  "High Risk": {
    label: "High Risk",
    color: "#f97316",
    bgColor: "bg-orange-950/40",
    borderColor: "border-orange-700",
    textColor: "text-orange-400",
  },
  "Moderate Risk": {
    label: "Moderate Risk",
    color: "#eab308",
    bgColor: "bg-yellow-950/40",
    borderColor: "border-yellow-700",
    textColor: "text-yellow-400",
  },
  "Investment Ready": {
    label: "Investment Ready",
    color: "#14b8a6",
    bgColor: "bg-teal-950/40",
    borderColor: "border-teal-700",
    textColor: "text-teal-400",
  },
  Exemplary: {
    label: "Exemplary",
    color: "#22c55e",
    bgColor: "bg-green-950/40",
    borderColor: "border-green-700",
    textColor: "text-green-400",
  },
};

export function scoreToVerdict(score: number): VerdictLevel {
  if (score < 30) return "Critical Risk";
  if (score < 50) return "High Risk";
  if (score < 70) return "Moderate Risk";
  if (score < 85) return "Investment Ready";
  return "Exemplary";
}
