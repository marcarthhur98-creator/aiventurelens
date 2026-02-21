"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { AnalysisResult } from "@/types/results.types";
import { VentureScoreGauge } from "@/components/results/VentureScoreGauge";
import { SectionRadarChart } from "@/components/results/SectionRadarChart";
import { SectionScoreCards } from "@/components/results/SectionScoreCards";
import { ActionItemsList } from "@/components/results/ActionItemsList";
import { VerdictBanner } from "@/components/results/VerdictBanner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem("aiventurelens_result");
    if (!raw) {
      router.replace("/assessment?expired=true");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setResult(parsed);
    } catch {
      router.replace("/assessment?expired=true");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-teal-600/20 border border-teal-700/50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
              AIventureLens
            </span>
          </Link>
          <Link href="/assessment">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 bg-transparent text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retake
            </Button>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center space-y-1"
        >
          <h1 className="text-2xl font-bold text-zinc-100">Venture Risk Score</h1>
          <p className="text-sm text-zinc-500">Your security & operational risk posture</p>
        </motion.div>

        {/* Score Gauge Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6"
        >
          <VentureScoreGauge
            score={result.compositeScore}
            verdict={result.verdict}
          />
        </motion.div>

        {/* Verdict Banner */}
        <VerdictBanner
          verdict={result.verdict}
          rationale={result.verdictRationale}
          summary={result.executiveSummary}
        />

        {/* Section Scores */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-base font-semibold text-zinc-200">Domain Scores</h2>
          <SectionScoreCards sectionScores={result.sectionScores} />
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6"
        >
          <h2 className="text-base font-semibold text-zinc-200 mb-4">Risk Radar</h2>
          <SectionRadarChart sectionScores={result.sectionScores} />
        </motion.div>

        {/* Strengths & Risk Flags */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-zinc-200">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="text-teal-600 mt-0.5 shrink-0">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Risk Flags */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-zinc-200">Risk Flags</h3>
            </div>
            <ul className="space-y-2">
              {result.riskFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="text-red-600 mt-0.5 shrink-0">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Priority Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <h2 className="text-base font-semibold text-zinc-200">Priority Actions</h2>
            </div>
            <span className="text-xs text-zinc-600">{result.priorityActions.length} items</span>
          </div>
          <p className="text-xs text-zinc-600">
            Sorted by severity — address critical and high items before your next funding round.
          </p>
          <ActionItemsList actions={result.priorityActions} />
        </motion.div>

        <Separator className="bg-zinc-800" />

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8"
        >
          <p className="text-sm text-zinc-600 text-center sm:text-left">
            Share your score with your team or advisor to prioritize remediation.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-400 hover:text-zinc-100 bg-transparent"
              onClick={() => {
                const text = `AIventureLens Risk Score: ${result.compositeScore}/100 — ${result.verdict}\n\nAssess your startup: ${window.location.origin}`;
                navigator.clipboard?.writeText(text);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Copy Summary
            </Button>
            <Link href="/assessment">
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-500 text-white"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Retake Assessment
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
