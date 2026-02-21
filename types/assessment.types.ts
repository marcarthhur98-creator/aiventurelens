export type SectionId =
  | "cloud_setup"
  | "security_practices"
  | "team_maturity"
  | "compliance_readiness";

export type QuestionType = "single_choice" | "multi_choice" | "boolean" | "scale";

export interface ChoiceOption {
  id: string;
  label: string;
  weight: number; // 0.0–1.0, higher = better security posture
}

export interface Question {
  id: string;
  sectionId: SectionId;
  type: QuestionType;
  text: string;
  helpText?: string;
  riskWeight: number; // 0.0–1.0, importance within section
  options?: ChoiceOption[]; // single_choice / multi_choice
  scaleMin?: number; // scale type
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
}

export interface Section {
  id: SectionId;
  title: string;
  description: string;
  weight: number; // 0.0–1.0, sum = 1.0
  questions: Question[];
}

// Answer value union
export type AnswerValue = string | string[] | boolean | number | null;

export interface Answer {
  questionId: string;
  sectionId: SectionId;
  value: AnswerValue;
}

// Company context (optional step 0)
export interface CompanyContext {
  companyName?: string;
  stage: "pre_seed" | "seed" | "series_a" | "series_b_plus";
  teamSize: "1-5" | "6-15" | "16-50" | "51+";
  industry?: string;
  hasSecurityBudget: boolean;
}

export interface AssessmentSubmission {
  companyContext: CompanyContext;
  answers: Answer[];
}
