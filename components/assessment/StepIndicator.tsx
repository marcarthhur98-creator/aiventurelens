"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-colors duration-300 border-2
                  ${isCompleted
                    ? "bg-teal-500 border-teal-500 text-white"
                    : isCurrent
                      ? "bg-transparent border-teal-400 text-teal-400"
                      : "bg-transparent border-zinc-700 text-zinc-600"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{step.id}</span>
                )}
              </motion.div>
              <span
                className={`text-xs hidden sm:block whitespace-nowrap transition-colors duration-300 ${
                  isCurrent ? "text-teal-400 font-medium" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`w-12 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-4 transition-colors duration-500 ${
                  isCompleted ? "bg-teal-500" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
