"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { companyContextSchema, type CompanyContextInput } from "@/lib/schema/assessment.schema";
import type { CompanyContext } from "@/types/assessment.types";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building2 } from "lucide-react";

interface CompanyContextFormProps {
  saved: CompanyContext | null;
  onNext: (data: CompanyContext) => void;
}

const STAGE_OPTIONS = [
  { value: "pre_seed", label: "Pre-Seed", desc: "Idea / early prototype" },
  { value: "seed", label: "Seed", desc: "Initial traction, raising seed" },
  { value: "series_a", label: "Series A", desc: "Product-market fit, scaling" },
  { value: "series_b_plus", label: "Series B+", desc: "Growth / late stage" },
] as const;

const TEAM_SIZE_OPTIONS = [
  { value: "1-5", label: "1–5" },
  { value: "6-15", label: "6–15" },
  { value: "16-50", label: "16–50" },
  { value: "51+", label: "51+" },
] as const;

export function CompanyContextForm({ saved, onNext }: CompanyContextFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyContextInput>({
    resolver: zodResolver(companyContextSchema),
    defaultValues: saved ?? {
      stage: "seed",
      teamSize: "1-5",
      hasSecurityBudget: false,
    },
  });

  const stage = watch("stage");
  const teamSize = watch("teamSize");
  const hasSecurityBudget = watch("hasSecurityBudget");

  const onSubmit = (data: CompanyContextInput) => {
    onNext(data as CompanyContext);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Company Context</h2>
            <p className="text-sm text-zinc-500">Help us calibrate scores to your stage</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">
              Company name <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              {...register("companyName")}
              placeholder="Acme Corp"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          {/* Funding Stage */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Funding stage *</label>
            <div className="grid grid-cols-2 gap-2">
              {STAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("stage", opt.value)}
                  className={`
                    flex flex-col items-start p-3 rounded-lg border text-left transition-all
                    ${stage === opt.value
                      ? "border-teal-500 bg-teal-950/30"
                      : "border-zinc-800 hover:border-zinc-700"
                    }
                  `}
                >
                  <span className={`text-sm font-medium ${stage === opt.value ? "text-teal-400" : "text-zinc-300"}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-zinc-600 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
            {errors.stage && <p className="text-xs text-red-400">{errors.stage.message}</p>}
          </div>

          {/* Team Size */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Team size *</label>
            <div className="flex gap-2">
              {TEAM_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("teamSize", opt.value)}
                  className={`
                    flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all
                    ${teamSize === opt.value
                      ? "border-teal-500 bg-teal-950/30 text-teal-400"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.teamSize && <p className="text-xs text-red-400">{errors.teamSize.message}</p>}
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">
              Industry <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              {...register("industry")}
              placeholder="e.g., FinTech, HealthTech, SaaS, DevTools..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          {/* Security Budget */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">
              Do you have a dedicated security budget?
            </label>
            <div className="flex gap-3">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setValue("hasSecurityBudget", value)}
                  className={`
                    flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all
                    ${hasSecurityBudget === value
                      ? value
                        ? "border-teal-500 bg-teal-950/30 text-teal-400"
                        : "border-zinc-600 bg-zinc-800/50 text-zinc-300"
                      : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium"
        >
          Start Assessment
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </motion.div>
  );
}
