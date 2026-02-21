"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { VerdictLevel } from "@/types/results.types";
import { VERDICT_CONFIG } from "@/types/results.types";

interface VentureScoreGaugeProps {
  score: number;
  verdict: VerdictLevel;
}

export function VentureScoreGauge({ score, verdict }: VentureScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = VERDICT_CONFIG[verdict];

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;

    const duration = 1500;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [score]);

  const data = [{ name: "score", value: displayScore, fill: config.color }];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-52 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="80%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={data}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: "#27272a" }}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Score text overlay */}
        <div className="absolute bottom-1 left-0 right-0 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold tabular-nums"
            style={{ color: config.color }}
          >
            {displayScore}
          </motion.span>
          <span className="text-xs text-zinc-500 -mt-0.5">out of 100</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${config.bgColor} ${config.borderColor} ${config.textColor}`}
      >
        {verdict}
      </motion.div>
    </div>
  );
}
