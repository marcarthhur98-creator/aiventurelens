"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SectionId } from "@/types/assessment.types";

interface SectionRadarChartProps {
  sectionScores: Record<SectionId, number>;
}

const SECTION_LABELS: Record<SectionId, string> = {
  cloud_setup: "Cloud Setup",
  security_practices: "Security",
  team_maturity: "Team",
  compliance_readiness: "Compliance",
};

export function SectionRadarChart({ sectionScores }: SectionRadarChartProps) {
  const data = (Object.keys(sectionScores) as SectionId[]).map((id) => ({
    subject: SECTION_LABELS[id],
    score: sectionScores[id],
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="#3f3f46" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#e4e4e7",
            fontSize: 12,
          }}
          formatter={(value) => [`${value ?? 0}/100`, "Score"]}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#14b8a6"
          fill="#14b8a6"
          fillOpacity={0.2}
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
