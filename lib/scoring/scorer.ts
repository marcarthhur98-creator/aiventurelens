import type { Answer, AnswerValue, Question, SectionId } from "@/types/assessment.types";
import { SECTIONS } from "@/lib/questions";

/**
 * Compute a normalized score [0–100] for a single answer.
 * Returns null if no answer was given.
 */
function getAnswerScore(question: Question, value: AnswerValue): number | null {
  if (value === null || value === undefined) return null;

  switch (question.type) {
    case "boolean": {
      return (value as boolean) ? 1.0 : 0.0;
    }
    case "scale": {
      const v = value as number;
      const min = question.scaleMin ?? 1;
      const max = question.scaleMax ?? 5;
      return (v - min) / (max - min);
    }
    case "single_choice": {
      const opt = question.options?.find((o) => o.id === (value as string));
      return opt?.weight ?? null;
    }
    case "multi_choice": {
      const selected = value as string[];
      if (!selected.length) return 0;
      // If "none" option (weight 0) is selected, treat as zero regardless
      const opts = question.options ?? [];
      const selectedOpts = opts.filter((o) => selected.includes(o.id));
      if (selectedOpts.some((o) => o.weight === 0.0)) return 0;
      // Average positive weights of selected options
      const total = selectedOpts.reduce((acc, o) => acc + o.weight, 0);
      // Max achievable = sum of all positive weights (excluding "none" options)
      const maxAchievable = opts
        .filter((o) => o.weight > 0)
        .reduce((acc, o) => acc + o.weight, 0);
      return maxAchievable > 0 ? total / maxAchievable : 0;
    }
    default:
      return null;
  }
}

export interface SectionPreScore {
  sectionId: SectionId;
  score: number; // 0–100
  answeredCount: number;
  totalCount: number;
}

export interface PreScoreResult {
  sectionScores: Record<SectionId, number>;
  compositeScore: number;
  sectionDetails: SectionPreScore[];
}

export function computePreScores(answers: Answer[]): PreScoreResult {
  const answerMap = new Map<string, AnswerValue>(
    answers.map((a) => [a.questionId, a.value])
  );

  const sectionDetails: SectionPreScore[] = SECTIONS.map((section) => {
    const questions = section.questions;
    let weightedScoreSum = 0;
    let weightSum = 0;
    let answeredCount = 0;

    for (const q of questions) {
      const rawValue = answerMap.get(q.id) ?? null;
      const score = getAnswerScore(q, rawValue);
      if (score !== null) {
        weightedScoreSum += score * q.riskWeight;
        weightSum += q.riskWeight;
        answeredCount++;
      }
    }

    const sectionScore = weightSum > 0 ? (weightedScoreSum / weightSum) * 100 : 0;

    return {
      sectionId: section.id,
      score: Math.round(sectionScore * 10) / 10,
      answeredCount,
      totalCount: questions.length,
    };
  });

  const sectionScores = Object.fromEntries(
    sectionDetails.map((d) => [d.sectionId, d.score])
  ) as Record<SectionId, number>;

  const compositeScore = SECTIONS.reduce((acc, section) => {
    return acc + (sectionScores[section.id] ?? 0) * section.weight;
  }, 0);

  return {
    sectionScores,
    compositeScore: Math.round(compositeScore * 10) / 10,
    sectionDetails,
  };
}
