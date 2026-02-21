import Anthropic from "@anthropic-ai/sdk";
import type { Answer, CompanyContext } from "@/types/assessment.types";
import type { AnalysisResult } from "@/types/results.types";
import { scoreToVerdict } from "@/types/results.types";
import { computePreScores } from "@/lib/scoring/scorer";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/analysis.prompt";
import { analysisResultSchema } from "@/lib/schema/results.schema";
import type { SectionId } from "@/types/assessment.types";

function buildFallbackResult(preScores: ReturnType<typeof computePreScores>): AnalysisResult {
  const { compositeScore, sectionScores } = preScores;
  const verdict = scoreToVerdict(compositeScore);

  const actions = [];
  let idx = 1;

  if (sectionScores.security_practices < 50) {
    actions.push({
      id: `action_${idx++}`,
      title: "Implement Secrets Management",
      description: "Move all secrets to a dedicated secrets manager (AWS Secrets Manager or HashiCorp Vault). Audit git history for any committed credentials immediately.",
      section: "security_practices" as SectionId,
      severity: "critical" as const,
      effort: "medium" as const,
      impact: "Prevents credential leaks — a top cause of startup security breaches and a major red flag for VCs.",
    });
  }
  if (sectionScores.cloud_setup < 50) {
    actions.push({
      id: `action_${idx++}`,
      title: "Enforce MFA and Least-Privilege IAM",
      description: "Enable MFA on all accounts, create role-based access policies, and remove root account from daily use.",
      section: "cloud_setup" as SectionId,
      severity: "critical" as const,
      effort: "low" as const,
      impact: "IAM misconfiguration is the #1 cloud breach vector. VCs routinely check this during technical due diligence.",
    });
  }
  if (sectionScores.compliance_readiness < 40) {
    actions.push({
      id: `action_${idx++}`,
      title: "Begin SOC 2 Readiness Program",
      description: "Engage a compliance platform (Vanta, Drata) to start SOC 2 Type I preparation.",
      section: "compliance_readiness" as SectionId,
      severity: "high" as const,
      effort: "high" as const,
      impact: "Enterprise customers and most Series A investors require SOC 2.",
    });
  }
  if (sectionScores.team_maturity < 50) {
    actions.push({
      id: `action_${idx++}`,
      title: "Implement CI/CD with Security Gates",
      description: "Set up automated testing, SAST scanning, and dependency vulnerability checks in your CI/CD pipeline.",
      section: "team_maturity" as SectionId,
      severity: "high" as const,
      effort: "medium" as const,
      impact: "Demonstrates engineering discipline and reduces breach risk from unreviewed code changes.",
    });
  }
  if (actions.length === 0) {
    actions.push({
      id: `action_${idx++}`,
      title: "Conduct Annual Penetration Test",
      description: "Engage an external security firm for a comprehensive penetration test.",
      section: "security_practices" as SectionId,
      severity: "medium" as const,
      effort: "medium" as const,
      impact: "External validation builds investor and customer confidence.",
    });
  }

  const strengths: string[] = [];
  if (sectionScores.cloud_setup >= 70) strengths.push("Strong cloud infrastructure security posture");
  if (sectionScores.security_practices >= 70) strengths.push("Mature security practices with automated scanning");
  if (sectionScores.team_maturity >= 70) strengths.push("Excellent engineering maturity with robust CI/CD");
  if (sectionScores.compliance_readiness >= 70) strengths.push("Advanced compliance readiness");
  if (strengths.length === 0) strengths.push("Completed a structured security self-assessment");

  const riskFlags: string[] = [];
  if (sectionScores.security_practices < 40) riskFlags.push("Critical: No secrets management — high credential exposure risk");
  if (sectionScores.cloud_setup < 40) riskFlags.push("Critical: Weak cloud IAM — elevated unauthorized access risk");
  if (sectionScores.compliance_readiness < 30) riskFlags.push("High: No compliance foundation — will block enterprise sales");
  if (sectionScores.team_maturity < 40) riskFlags.push("High: Immature engineering processes — operational reliability risk");
  if (riskFlags.length === 0) riskFlags.push("Continue monitoring and improving across all security domains");

  return {
    compositeScore,
    sectionScores,
    verdict,
    verdictRationale: `Based on your assessment responses, your composite risk score is ${compositeScore}/100. This places you in the ${verdict} category.`,
    executiveSummary: `This startup achieved a composite security score of ${compositeScore}/100 across four key domains. Addressing the priority actions below will materially improve investor confidence.`,
    priorityActions: actions,
    strengths,
    riskFlags,
  };
}

export async function analyzeAssessment(
  companyContext: CompanyContext,
  answers: Answer[]
): Promise<AnalysisResult> {
  const preScores = computePreScores(answers);

  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return buildFallbackResult(preScores);
  }

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  try {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(companyContext, answers, preScores);

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawContent = message.content[0];
    if (rawContent.type !== "text") throw new Error("Unexpected response type");

    let jsonText = rawContent.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonText = jsonMatch[1].trim();

    const parsed = JSON.parse(jsonText);
    const validated = analysisResultSchema.safeParse(parsed);
    if (!validated.success) throw new Error("Invalid JSON structure from Claude");

    return validated.data as AnalysisResult;
  } catch {
    return buildFallbackResult(preScores);
  }
}
