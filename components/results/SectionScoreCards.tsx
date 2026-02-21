"use client";

import { motion } from "framer-motion";
import type { SectionId } from "@/types/assessment.types";
import { scoreToVerdict, VERDICT_CONFIG } from "@/types/results.types";
import { Cloud, ShieldCheck, Users, FileCheck } from "lucide-react";

interface SectionScoreCardsProps {
  sectionScores: Record<SectionId, number>;
}

const SECTION_META: Record<
  SectionId,
  { label: string; Icon: React.ComponentType<{ className?: string }>; weight: string }
> = {
  cloud_setup: { label: "Cloud Setup", Icon: Cloud, weight: "25%" },
  security_practices: { label: "Security Practices", Icon: ShieldCheck, weight: "35%" },
  team_maturity: { label: "Team Maturity", Icon: Users, weight: "25%" },
  compliance_readiness: { label: "Compliance Readiness", Icon: FileCheck, weight: "15%" },
};

export function SectionScoreCards({ sectionScores }: SectionScoreCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.keys(sectionScores) as SectionId[]).map((id, i) => {
        const score = sectionScores[id];
        const verdict = scoreToVerdict(score);
        const config = VERDICT_CONFIG[verdict];
        const { label, Icon, weight } = SECTION_META[id];

        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-medium text-zinc-400">{label}</span>
              </div>
              <span className="text-xs text-zinc-700">{weight}</span>
            </div>

            <div className="flex items-end justify-between">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color: config.color }}
              >
                {score}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}
              >
                {verdict}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: 0.2 + 0.1 * i, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: config.color }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
