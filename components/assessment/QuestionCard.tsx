"use client";

import { useController, Control } from "react-hook-form";
import { motion } from "framer-motion";
import type { Question } from "@/types/assessment.types";
import { Info } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldName: string;
  index: number;
}

export function QuestionCard({ question, control, fieldName, index }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4"
    >
      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <span className="text-xs font-mono text-zinc-600 mt-0.5 shrink-0">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <h3 className="text-sm font-medium text-zinc-100 leading-snug">
            {question.text}
          </h3>
        </div>
        {question.helpText && (
          <div className="flex items-start gap-1.5 ml-6">
            <Info className="w-3 h-3 text-zinc-600 mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-500">{question.helpText}</p>
          </div>
        )}
      </div>

      <div className="ml-6">
        {question.type === "single_choice" && (
          <SingleChoiceInput question={question} control={control} fieldName={fieldName} />
        )}
        {question.type === "multi_choice" && (
          <MultiChoiceInput question={question} control={control} fieldName={fieldName} />
        )}
        {question.type === "boolean" && (
          <BooleanInput control={control} fieldName={fieldName} />
        )}
        {question.type === "scale" && (
          <ScaleInput question={question} control={control} fieldName={fieldName} />
        )}
      </div>
    </motion.div>
  );
}

function SingleChoiceInput({
  question,
  control,
  fieldName,
}: {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldName: string;
}) {
  const { field } = useController({ control, name: fieldName });

  return (
    <div className="space-y-2">
      {question.options?.map((opt) => (
        <label
          key={opt.id}
          className={`
            flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150
            ${field.value === opt.id
              ? "border-teal-500 bg-teal-950/30 text-zinc-100"
              : "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300"
            }
          `}
        >
          <div
            className={`
              mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
              transition-colors duration-150
              ${field.value === opt.id ? "border-teal-400" : "border-zinc-700"}
            `}
          >
            {field.value === opt.id && (
              <div className="w-2 h-2 rounded-full bg-teal-400" />
            )}
          </div>
          <span className="text-sm leading-snug">{opt.label}</span>
          <input
            type="radio"
            value={opt.id}
            checked={field.value === opt.id}
            onChange={() => field.onChange(opt.id)}
            className="sr-only"
          />
        </label>
      ))}
    </div>
  );
}

function MultiChoiceInput({
  question,
  control,
  fieldName,
}: {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldName: string;
}) {
  const { field } = useController({
    control,
    name: fieldName,
    defaultValue: [],
  });

  const selected: string[] = field.value || [];

  const toggle = (optId: string) => {
    // "none" option logic
    const noneOpt = question.options?.find((o) => o.weight === 0.0);
    if (noneOpt && optId === noneOpt.id) {
      field.onChange([optId]);
      return;
    }
    // Deselect "none" if selecting something else
    const withoutNone = selected.filter((id) => id !== noneOpt?.id);
    if (withoutNone.includes(optId)) {
      field.onChange(withoutNone.filter((id) => id !== optId));
    } else {
      field.onChange([...withoutNone, optId]);
    }
  };

  return (
    <div className="space-y-2">
      {question.options?.map((opt) => {
        const isSelected = selected.includes(opt.id);
        return (
          <label
            key={opt.id}
            className={`
              flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150
              ${isSelected
                ? "border-teal-500 bg-teal-950/30 text-zinc-100"
                : "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300"
              }
            `}
            onClick={() => toggle(opt.id)}
          >
            <div
              className={`
                mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center
                transition-colors duration-150
                ${isSelected ? "border-teal-400 bg-teal-400" : "border-zinc-700"}
              `}
            >
              {isSelected && (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm leading-snug">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function BooleanInput({
  control,
  fieldName,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldName: string;
}) {
  const { field } = useController({ control, name: fieldName });

  return (
    <div className="flex gap-3">
      {[
        { label: "Yes", value: true },
        { label: "No", value: false },
      ].map(({ label, value }) => (
        <label
          key={label}
          className={`
            flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer
            transition-all duration-150 text-sm font-medium
            ${field.value === value
              ? value
                ? "border-teal-500 bg-teal-950/30 text-teal-400"
                : "border-red-800 bg-red-950/30 text-red-400"
              : "border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
            }
          `}
        >
          <input
            type="radio"
            checked={field.value === value}
            onChange={() => field.onChange(value)}
            className="sr-only"
          />
          {label}
        </label>
      ))}
    </div>
  );
}

function ScaleInput({
  question,
  control,
  fieldName,
}: {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  fieldName: string;
}) {
  const { field } = useController({ control, name: fieldName });
  const min = question.scaleMin ?? 1;
  const max = question.scaleMax ?? 5;
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  const colorForValue = (v: number) => {
    const ratio = (v - min) / (max - min);
    if (ratio <= 0.25) return "border-red-700 bg-red-950/30 text-red-400";
    if (ratio <= 0.5) return "border-orange-700 bg-orange-950/30 text-orange-400";
    if (ratio <= 0.75) return "border-yellow-700 bg-yellow-950/30 text-yellow-400";
    return "border-teal-600 bg-teal-950/30 text-teal-400";
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {steps.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => field.onChange(v)}
            className={`
              flex-1 h-10 rounded-lg border-2 text-sm font-semibold
              transition-all duration-150
              ${field.value === v
                ? colorForValue(v)
                : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
              }
            `}
          >
            {v}
          </button>
        ))}
      </div>
      {question.scaleLabels && (
        <div className="flex justify-between">
          <span className="text-xs text-zinc-600">{question.scaleLabels.min}</span>
          <span className="text-xs text-zinc-600">{question.scaleLabels.max}</span>
        </div>
      )}
    </div>
  );
}
