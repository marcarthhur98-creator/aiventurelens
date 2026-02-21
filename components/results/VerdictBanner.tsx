"use client";

import { motion } from "framer-motion";
import type { VerdictLevel } from "@/types/results.types";
import { VERDICT_CONFIG } from "@/types/results.types";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";

interface VerdictBannerProps {
  verdict: VerdictLevel;
  rationale: string;
  summary: string;
}

export function VerdictBanner({ verdict, rationale, summary }: VerdictBannerProps) {
  const config = VERDICT_CONFIG[verdict];
  const isCritical = verdict === "Critical Risk" || verdict === "High Risk";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.2 }}
      className={`rounded-xl border p-5 space-y-3 ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${config.textColor}`}>
          {isCritical ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <TrendingUp className="w-5 h-5" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${config.textColor}`}>Verdict Rationale</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{rationale}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-1 border-t border-zinc-800/60">
        <Info className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-500 leading-relaxed">{summary}</p>
      </div>
    </motion.div>
  );
}
