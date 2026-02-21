import type { Answer, CompanyContext, SectionId } from "@/types/assessment.types";
import type { PreScoreResult } from "@/lib/scoring/scorer";
import { SECTIONS, SECTION_MAP } from "@/lib/questions";

export function buildSystemPrompt(): string {
  return `You are a senior VC due diligence analyst and security engineer specializing in early-stage startup risk assessment. Your role is to evaluate startups' security and operational posture to determine investment readiness.

You have deep expertise in:
- Cloud infrastructure security (AWS, GCP, Azure)
- Application security practices and DevSecOps
- Engineering team maturity and operational excellence
- Regulatory compliance (SOC 2, GDPR, HIPAA, PCI-DSS)

Your task is to analyze a startup's self-assessment responses and produce a structured risk report in strict JSON format. You are direct, precise, and data-driven. You contextualize findings based on the startup's stage and team size — a pre-seed team of 3 is held to different standards than a Series A team of 30.

CRITICAL: You MUST respond with ONLY valid JSON matching this exact schema, no markdown, no explanation outside the JSON:

{
  "compositeScore": <number 0-100>,
  "sectionScores": {
    "cloud_setup": <number 0-100>,
    "security_practices": <number 0-100>,
    "team_maturity": <number 0-100>,
    "compliance_readiness": <number 0-100>
  },
  "verdict": <"Critical Risk" | "High Risk" | "Moderate Risk" | "Investment Ready" | "Exemplary">,
  "verdictRationale": <string, 2-3 sentences explaining the verdict>,
  "executiveSummary": <string, 3-4 sentences VC-style executive summary of risk posture>,
  "priorityActions": [
    {
      "id": <string, unique e.g. "action_1">,
      "title": <string, concise action title>,
      "description": <string, specific actionable steps>,
      "section": <"cloud_setup" | "security_practices" | "team_maturity" | "compliance_readiness">,
      "severity": <"critical" | "high" | "medium" | "low">,
      "effort": <"low" | "medium" | "high">,
      "impact": <string, what this fixes and why it matters to investors>
    }
  ],
  "strengths": [<string>, ...],
  "riskFlags": [<string>, ...]
}

Scoring guidance:
- Adjust pre-computed scores up/down by up to 15 points based on contextual factors
- Consider startup stage: pre-seed (0-30 is expected), seed (30-50 expected), series_a (50-70 expected), series_b_plus (70+ expected)
- Verdict thresholds: 0-29=Critical Risk, 30-49=High Risk, 50-69=Moderate Risk, 70-84=Investment Ready, 85-100=Exemplary
- Generate 4-8 priorityActions, sorted by severity (critical first)
- Generate 2-5 strengths
- Generate 2-6 riskFlags (specific, investor-relevant risks)`;
}

function formatAnswersForPrompt(answers: Answer[], sectionId: SectionId): string {
  const section = SECTION_MAP.get(sectionId);
  if (!section) return "";

  const lines: string[] = [];
  for (const q of section.questions) {
    const answer = answers.find((a) => a.questionId === q.id);
    const valueStr = formatAnswerValue(answer?.value ?? null, q.type);
    lines.push(`  Q: ${q.text}`);
    lines.push(`  A: ${valueStr}`);
    lines.push("");
  }
  return lines.join("\n");
}

function formatAnswerValue(
  value: Answer["value"],
  type: string
): string {
  if (value === null || value === undefined) return "(not answered)";
  if (type === "boolean") return value ? "Yes" : "No";
  if (type === "scale") return `${value}/5`;
  if (Array.isArray(value)) return value.join(", ") || "(none selected)";
  return String(value);
}

export function buildUserPrompt(
  companyContext: CompanyContext,
  answers: Answer[],
  preScores: PreScoreResult
): string {
  const stageLabels: Record<string, string> = {
    pre_seed: "Pre-Seed",
    seed: "Seed",
    series_a: "Series A",
    series_b_plus: "Series B+",
  };

  const sectionSummary = SECTIONS.map((s) => {
    const score = preScores.sectionScores[s.id];
    const detail = preScores.sectionDetails.find((d) => d.sectionId === s.id);
    return `  ${s.title}: ${score}/100 (${detail?.answeredCount}/${detail?.totalCount} questions answered)`;
  }).join("\n");

  const sectionsDetailed = SECTIONS.map((s) => {
    return `### ${s.title} (Pre-score: ${preScores.sectionScores[s.id]}/100)\n${formatAnswersForPrompt(answers, s.id)}`;
  }).join("\n");

  return `## Startup Context
- Company: ${companyContext.companyName || "Unnamed Startup"}
- Stage: ${stageLabels[companyContext.stage] || companyContext.stage}
- Team Size: ${companyContext.teamSize} employees
- Industry: ${companyContext.industry || "Not specified"}
- Has dedicated security budget: ${companyContext.hasSecurityBudget ? "Yes" : "No"}

## Pre-Computed Scores (deterministic, use as baseline)
${sectionSummary}
- Composite Score: ${preScores.compositeScore}/100

## Detailed Assessment Responses

${sectionsDetailed}

## Your Task
Analyze the above responses in the context of the startup's stage and team size. Adjust the pre-computed scores where contextual factors warrant it. Return the complete AnalysisResult JSON as specified in your instructions.`;
}
