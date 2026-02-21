import type { Section, SectionId } from "@/types/assessment.types";
import { cloudSetupQuestions } from "./cloud-setup";
import { securityPracticesQuestions } from "./security-practices";
import { teamMaturityQuestions } from "./team-maturity";
import { complianceReadinessQuestions } from "./compliance-readiness";

export const SECTIONS: Section[] = [
  {
    id: "cloud_setup",
    title: "Cloud Setup",
    description: "Evaluate your cloud infrastructure security, IAM configuration, and operational resilience.",
    weight: 0.25,
    questions: cloudSetupQuestions,
  },
  {
    id: "security_practices",
    title: "Security Practices",
    description: "Assess secrets management, vulnerability scanning, encryption, and incident response readiness.",
    weight: 0.35,
    questions: securityPracticesQuestions,
  },
  {
    id: "team_maturity",
    title: "Team Maturity",
    description: "Review CI/CD pipelines, observability, code review practices, and on-call processes.",
    weight: 0.25,
    questions: teamMaturityQuestions,
  },
  {
    id: "compliance_readiness",
    title: "Compliance Readiness",
    description: "Understand your data classification, GDPR/CCPA posture, SOC 2 progress, and vendor risk management.",
    weight: 0.15,
    questions: complianceReadinessQuestions,
  },
];

export const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);

export const SECTION_MAP = new Map<SectionId, Section>(
  SECTIONS.map((s) => [s.id, s])
);

export function getSectionQuestions(sectionId: SectionId) {
  return SECTION_MAP.get(sectionId)?.questions ?? [];
}
