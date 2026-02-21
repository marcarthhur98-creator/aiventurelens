import { z } from "zod";

export const companyContextSchema = z.object({
  companyName: z.string().optional(),
  stage: z.enum(["pre_seed", "seed", "series_a", "series_b_plus"]),
  teamSize: z.enum(["1-5", "6-15", "16-50", "51+"]),
  industry: z.string().optional(),
  hasSecurityBudget: z.boolean(),
});

export const answerSchema = z.object({
  questionId: z.string(),
  sectionId: z.enum([
    "cloud_setup",
    "security_practices",
    "team_maturity",
    "compliance_readiness",
  ]),
  value: z.union([z.string(), z.array(z.string()), z.boolean(), z.number(), z.null()]),
});

export const assessmentSubmissionSchema = z.object({
  companyContext: companyContextSchema,
  answers: z.array(answerSchema),
});

export type CompanyContextInput = z.infer<typeof companyContextSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type AssessmentSubmissionInput = z.infer<typeof assessmentSubmissionSchema>;
