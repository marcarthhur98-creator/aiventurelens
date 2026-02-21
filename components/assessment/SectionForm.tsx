"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import type { Section, AnswerValue } from "@/types/assessment.types";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface SectionFormProps {
  section: Section;
  savedAnswers: Record<string, AnswerValue>;
  onNext: (answers: Record<string, AnswerValue>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function buildSectionSchema(section: Section) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const q of section.questions) {
    if (q.type === "boolean") {
      shape[q.id] = z.boolean();
    } else if (q.type === "scale") {
      shape[q.id] = z.number().min(q.scaleMin ?? 1).max(q.scaleMax ?? 5);
    } else if (q.type === "single_choice") {
      shape[q.id] = z.string().min(1, "Please select an option");
    } else if (q.type === "multi_choice") {
      shape[q.id] = z.array(z.string()).min(1, "Please select at least one option");
    }
  }
  return z.object(shape);
}

export function SectionForm({
  section,
  savedAnswers,
  onNext,
  onBack,
  isFirst,
  isLast,
}: SectionFormProps) {
  const schema = buildSectionSchema(section);
  type FormValues = z.infer<typeof schema>;

  const defaultValues: FormValues = {} as FormValues;
  for (const q of section.questions) {
    if (savedAnswers[q.id] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (defaultValues as any)[q.id] = savedAnswers[q.id];
    } else if (q.type === "multi_choice") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (defaultValues as any)[q.id] = [];
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: FormValues) => {
    onNext(data as Record<string, AnswerValue>);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-100">{section.title}</h2>
          <p className="text-sm text-zinc-500">{section.description}</p>
        </div>

        <div className="space-y-4">
          {section.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              control={control}
              fieldName={q.id}
              index={i}
            />
          ))}
        </div>

        {hasErrors && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-4 py-3"
          >
            Please answer all questions before continuing.
          </motion.div>
        )}

        <div className="flex gap-3 pt-2">
          {!isFirst && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 sm:flex-none border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-medium"
          >
            {isLast ? "Submit Assessment" : "Continue"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
