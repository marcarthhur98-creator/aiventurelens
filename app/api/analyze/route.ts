import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { assessmentSubmissionSchema } from "@/lib/schema/assessment.schema";
import { analysisResultSchema } from "@/lib/schema/results.schema";
import { computePreScores } from "@/lib/scoring/scorer";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/analysis.prompt";
import { scoreToVerdict } from "@/types/results.types";

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parseResult = assessmentSubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { companyContext, answers } = parseResult.data;

    // Layer 1: Deterministic pre-score
    const preScores = computePreScores(answers as Parameters<typeof computePreScores>[0]);

    // Layer 2: Claude-adjusted analysis
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(
      companyContext as Parameters<typeof buildUserPrompt>[0],
      answers as Parameters<typeof buildUserPrompt>[1],
      preScores
    );

    let analysisResult;

    try {
      const message = await anthropic.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 2048,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const rawContent = message.content[0];
      if (rawContent.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Extract JSON from response (handle potential markdown code blocks)
      let jsonText = rawContent.text.trim();
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      const parsed = JSON.parse(jsonText);
      const validated = analysisResultSchema.safeParse(parsed);

      if (!validated.success) {
        console.error("Claude response validation failed:", validated.error.flatten());
        throw new Error("Claude returned invalid JSON structure");
      }

      analysisResult = validated.data;
    } catch (claudeError) {
      // Fallback: use pre-scores with generated action items
      console.error("Claude error, using fallback:", claudeError);
      analysisResult = buildFallbackResult(preScores);
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildFallbackResult(preScores: ReturnType<typeof computePreScores>) {
  const { compositeScore, sectionScores } = preScores;
  const verdict = scoreToVerdict(compositeScore);

  return {
    compositeScore,
    sectionScores,
    verdict,
    verdictRationale: `Based on your assessment responses, your composite risk score is ${compositeScore}/100. This places you in the ${verdict} category. Review the priority actions below to improve your posture.`,
    executiveSummary: `This startup achieved a composite security score of ${compositeScore}/100 across four key domains. The assessment reveals areas requiring immediate attention before institutional investment. Addressing the priority actions below will materially improve investor confidence.`,
    priorityActions: generateFallbackActions(sectionScores),
    strengths: generateFallbackStrengths(sectionScores),
    riskFlags: generateFallbackRiskFlags(sectionScores),
  };
}

function generateFallbackActions(
  sectionScores: Record<string, number>
) {
  const actions = [];
  let idx = 1;

  if (sectionScores.security_practices < 50) {
    actions.push({
      id: `action_${idx++}`,
      title: "Implement Secrets Management",
      description: "Move all secrets to a dedicated secrets manager (AWS Secrets Manager or HashiCorp Vault). Audit git history for any committed credentials immediately.",
      section: "security_practices" as const,
      severity: "critical" as const,
      effort: "medium" as const,
      impact: "Prevents credential leaks — a top cause of startup security breaches and a major red flag for VCs.",
    });
  }

  if (sectionScores.cloud_setup < 50) {
    actions.push({
      id: `action_${idx++}`,
      title: "Enforce MFA and Least-Privilege IAM",
      description: "Enable MFA on all accounts, create role-based access policies, remove root account from daily use, and audit all IAM permissions.",
      section: "cloud_setup" as const,
      severity: "critical" as const,
      effort: "low" as const,
      impact: "IAM misconfiguration is the #1 cloud breach vector. VCs routinely check this during technical due diligence.",
    });
  }

  if (sectionScores.compliance_readiness < 40) {
    actions.push({
      id: `action_${idx++}`,
      title: "Begin SOC 2 Readiness Program",
      description: "Engage a compliance platform (Vanta, Drata, or Secureframe) to start SOC 2 Type I preparation. Prioritize evidence collection for security controls.",
      section: "compliance_readiness" as const,
      severity: "high" as const,
      effort: "high" as const,
      impact: "Enterprise customers and most Series A investors require SOC 2. Starting now prevents a 6-12 month delay in deals.",
    });
  }

  if (sectionScores.team_maturity < 50) {
    actions.push({
      id: `action_${idx++}`,
      title: "Implement CI/CD with Security Gates",
      description: "Set up automated testing, SAST scanning, and dependency vulnerability checks in your CI/CD pipeline. Require PR reviews before merging.",
      section: "team_maturity" as const,
      severity: "high" as const,
      effort: "medium" as const,
      impact: "Demonstrates engineering discipline and reduces breach risk from unreviewed code changes.",
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: `action_${idx++}`,
      title: "Conduct Annual Penetration Test",
      description: "Engage an external security firm for a comprehensive penetration test of your application and infrastructure.",
      section: "security_practices" as const,
      severity: "medium" as const,
      effort: "medium" as const,
      impact: "External validation of your security posture builds investor and customer confidence.",
    });
  }

  return actions;
}

function generateFallbackStrengths(sectionScores: Record<string, number>): string[] {
  const strengths: string[] = [];
  if (sectionScores.cloud_setup >= 70) strengths.push("Strong cloud infrastructure security posture with good IAM and network segmentation");
  if (sectionScores.security_practices >= 70) strengths.push("Mature security practices with automated scanning and incident response readiness");
  if (sectionScores.team_maturity >= 70) strengths.push("Excellent engineering maturity with robust CI/CD and observability");
  if (sectionScores.compliance_readiness >= 70) strengths.push("Advanced compliance readiness with data classification and regulatory awareness");
  if (strengths.length === 0) strengths.push("Completed a structured security self-assessment — demonstrates security awareness");
  return strengths;
}

function generateFallbackRiskFlags(sectionScores: Record<string, number>): string[] {
  const flags: string[] = [];
  if (sectionScores.security_practices < 40) flags.push("Critical: No secrets management — high credential exposure risk");
  if (sectionScores.cloud_setup < 40) flags.push("Critical: Weak cloud IAM — elevated risk of unauthorized access");
  if (sectionScores.compliance_readiness < 30) flags.push("High: No compliance foundation — will block enterprise sales and Series A");
  if (sectionScores.team_maturity < 40) flags.push("High: Immature engineering processes — operational reliability risk");
  if (flags.length === 0) flags.push("Continue monitoring and improving across all security domains");
  return flags;
}
