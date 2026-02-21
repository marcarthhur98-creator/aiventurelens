import { z } from "zod";

const sectionIdEnum = z.enum([
  "cloud_setup",
  "security_practices",
  "team_maturity",
  "compliance_readiness",
]);

const actionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  section: sectionIdEnum,
  severity: z.enum(["critical", "high", "medium", "low"]),
  effort: z.enum(["low", "medium", "high"]),
  impact: z.string(),
});

export const analysisResultSchema = z.object({
  compositeScore: z.number().min(0).max(100),
  sectionScores: z.object({
    cloud_setup: z.number().min(0).max(100),
    security_practices: z.number().min(0).max(100),
    team_maturity: z.number().min(0).max(100),
    compliance_readiness: z.number().min(0).max(100),
  }),
  verdict: z.enum([
    "Critical Risk",
    "High Risk",
    "Moderate Risk",
    "Investment Ready",
    "Exemplary",
  ]),
  verdictRationale: z.string(),
  executiveSummary: z.string(),
  priorityActions: z.array(actionItemSchema),
  strengths: z.array(z.string()),
  riskFlags: z.array(z.string()),
});
