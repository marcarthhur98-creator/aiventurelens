"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActionItem } from "@/types/results.types";
import { ChevronDown, Zap, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActionItemsListProps {
  actions: ActionItem[];
}

const SEVERITY_CONFIG = {
  critical: { label: "Critical", className: "bg-red-950/50 text-red-400 border-red-800" },
  high: { label: "High", className: "bg-orange-950/50 text-orange-400 border-orange-800" },
  medium: { label: "Medium", className: "bg-yellow-950/50 text-yellow-400 border-yellow-800" },
  low: { label: "Low", className: "bg-zinc-800/80 text-zinc-400 border-zinc-700" },
};

const EFFORT_CONFIG = {
  low: { label: "Low effort", color: "text-green-400" },
  medium: { label: "Medium effort", color: "text-yellow-400" },
  high: { label: "High effort", color: "text-red-400" },
};

const SECTION_LABELS = {
  cloud_setup: "Cloud Setup",
  security_practices: "Security",
  team_maturity: "Team",
  compliance_readiness: "Compliance",
};

export function ActionItemsList({ actions }: ActionItemsListProps) {
  const [expanded, setExpanded] = useState<string | null>(actions[0]?.id ?? null);

  if (!actions.length) return null;

  return (
    <div className="space-y-2">
      {actions.map((action, i) => {
        const isOpen = expanded === action.id;
        const severityConfig = SEVERITY_CONFIG[action.severity];
        const effortConfig = EFFORT_CONFIG[action.effort];

        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * i }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : action.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge
                  className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 border ${severityConfig.className}`}
                >
                  {severityConfig.label}
                </Badge>
                <span className="text-sm font-medium text-zinc-200 truncate">
                  {action.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-zinc-600 hidden sm:block">
                  {SECTION_LABELS[action.section]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-zinc-800">
                    <p className="text-sm text-zinc-400 leading-relaxed pt-3">
                      {action.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-zinc-600">Effort</p>
                          <p className={`text-xs font-medium ${effortConfig.color}`}>
                            {effortConfig.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-zinc-600">Section</p>
                          <p className="text-xs font-medium text-zinc-400">
                            {SECTION_LABELS[action.section]}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-zinc-800/40 rounded-lg p-3">
                      <Target className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-zinc-600 mb-0.5">Why this matters</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">{action.impact}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
