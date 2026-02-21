"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SECTIONS } from "@/lib/questions";
import type { Answer, AnswerValue, CompanyContext } from "@/types/assessment.types";
import type { AnalysisResult } from "@/types/results.types";
import { CompanyContextForm } from "./CompanyContextForm";
import { SectionForm } from "./SectionForm";
import { StepIndicator } from "./StepIndicator";
import { Loader2, ShieldAlert } from "lucide-react";

type SectionAnswers = Record<string, AnswerValue>;

const STEPS = [
  { id: 0, label: "Company" },
  { id: 1, label: "Cloud" },
  { id: 2, label: "Security" },
  { id: 3, label: "Team" },
  { id: 4, label: "Compliance" },
];

export function AssessmentWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [companyContext, setCompanyContext] = useState<CompanyContext | null>(null);
  const [sectionAnswers, setSectionAnswers] = useState<Record<number, SectionAnswers>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const handleContextNext = (data: CompanyContext) => {
    setCompanyContext(data);
    setCurrentStep(1);
  };

  const handleSectionNext = async (stepIndex: number, answers: SectionAnswers) => {
    setSectionAnswers((prev) => ({ ...prev, [stepIndex]: answers }));

    const isLastSection = stepIndex === SECTIONS.length;

    if (!isLastSection) {
      setCurrentStep(stepIndex + 1);
      return;
    }

    // All sections complete — submit
    const allAnswers: Answer[] = [];
    const allSectionAnswers = { ...sectionAnswers, [stepIndex]: answers };

    for (let si = 0; si < SECTIONS.length; si++) {
      const section = SECTIONS[si];
      const secAnswers = allSectionAnswers[si + 1] ?? {};
      for (const [questionId, value] of Object.entries(secAnswers)) {
        allAnswers.push({
          questionId,
          sectionId: section.id,
          value,
        });
      }
    }

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyContext: companyContext!,
          answers: allAnswers,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      sessionStorage.setItem("aiventurelens_result", JSON.stringify(result));
      router.push("/results");
    } catch (err) {
      setIsAnalyzeError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`);
      setIsAnalyzing(false);
    }
  };

  function setIsAnalyzeError(msg: string) {
    setAnalyzeError(msg);
  }

  const handleBack = (stepIndex: number) => {
    setCurrentStep(stepIndex - 1);
  };

  return (
    <div className="relative">
      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {analyzeError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-4 py-3"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {analyzeError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-zinc-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-zinc-100 font-medium">Analyzing your security posture...</p>
              <p className="text-zinc-500 text-sm">Claude AI is reviewing your responses</p>
            </div>
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-teal-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <CompanyContextForm
            key="company"
            saved={companyContext}
            onNext={handleContextNext}
          />
        )}

        {SECTIONS.map((section, i) => {
          const stepIndex = i + 1;
          if (currentStep !== stepIndex) return null;
          return (
            <SectionForm
              key={section.id}
              section={section}
              savedAnswers={sectionAnswers[stepIndex] ?? {}}
              onNext={(answers) => handleSectionNext(stepIndex, answers)}
              onBack={() => handleBack(stepIndex)}
              isFirst={false}
              isLast={stepIndex === SECTIONS.length}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
