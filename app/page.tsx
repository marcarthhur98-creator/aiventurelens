import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  BarChart3,
  ClipboardCheck,
  ArrowRight,
  Cloud,
  Lock,
  Users,
  FileCheck,
  Star,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    Icon: Cloud,
    title: "Cloud Setup",
    desc: "IAM/MFA configuration, network segmentation, backup strategy, audit logging, and IaC maturity.",
    weight: "25%",
    color: "text-sky-400",
    bg: "bg-sky-950/30 border-sky-800",
  },
  {
    Icon: Lock,
    title: "Security Practices",
    desc: "Secrets management, vulnerability scanning, pen testing, incident response, and encryption posture.",
    weight: "35%",
    color: "text-teal-400",
    bg: "bg-teal-950/30 border-teal-800",
  },
  {
    Icon: Users,
    title: "Team Maturity",
    desc: "CI/CD pipelines, observability, on-call rotations, code review discipline, and test coverage.",
    weight: "25%",
    color: "text-purple-400",
    bg: "bg-purple-950/30 border-purple-800",
  },
  {
    Icon: FileCheck,
    title: "Compliance Readiness",
    desc: "Data classification, GDPR/CCPA obligations, privacy policy, SOC 2 progress, and vendor risk.",
    weight: "15%",
    color: "text-orange-400",
    bg: "bg-orange-950/30 border-orange-800",
  },
];

const VERDICTS = [
  { score: "0-29", label: "Critical Risk", color: "text-red-400", bg: "bg-red-950/30 border-red-800" },
  { score: "30-49", label: "High Risk", color: "text-orange-400", bg: "bg-orange-950/30 border-orange-800" },
  { score: "50-69", label: "Moderate Risk", color: "text-yellow-400", bg: "bg-yellow-950/30 border-yellow-800" },
  { score: "70-84", label: "Investment Ready", color: "text-teal-400", bg: "bg-teal-950/30 border-teal-800" },
  { score: "85-100", label: "Exemplary", color: "text-green-400", bg: "bg-green-950/30 border-green-800" },
];

const HOW_IT_WORKS = [
  {
    Icon: ClipboardCheck,
    step: "01",
    title: "Complete 32 Questions",
    desc: "Answer questions across 4 key security domains in about 8 minutes.",
  },
  {
    Icon: Zap,
    step: "02",
    title: "AI-Powered Analysis",
    desc: "Claude AI analyzes your answers using VC due diligence criteria calibrated to your stage.",
  },
  {
    Icon: BarChart3,
    step: "03",
    title: "Get Your Risk Score",
    desc: "Receive a 0-100 Venture Risk Score with visualizations and categorized risk levels.",
  },
  {
    Icon: TrendingUp,
    step: "04",
    title: "Prioritized Actions",
    desc: "Get a sorted list of remediation actions with effort estimates and investor impact context.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-900 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600/20 border border-teal-700/50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <span className="font-bold text-zinc-100">AIventureLens</span>
          </div>
          <Link href="/assessment">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium">
              Start Assessment
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge className="bg-teal-950/50 text-teal-400 border-teal-800 text-xs px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Powered by Claude AI
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 leading-tight">
            Know your{" "}
            <span className="text-teal-400">security posture</span>{" "}
            before investors do
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered security and operational risk assessment for early-stage startups.
            Get a Venture Risk Score and prioritized action plan in under 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/assessment">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8">
                Start Free Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <span className="text-sm text-zinc-600">32 questions · No account required</span>
          </div>

          {/* Score preview */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            {VERDICTS.map((v) => (
              <div
                key={v.label}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${v.bg} ${v.color}`}
              >
                <span className="text-zinc-600 mr-1">{v.score}</span>
                {v.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-100">How it works</h2>
            <p className="text-sm text-zinc-500 mt-2">Four steps to investment-grade security clarity</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ Icon, step, title, desc }) => (
              <div key={step} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-700">{step}</span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-teal-400" />
                  </div>
                </div>
                <h3 className="font-semibold text-zinc-200 text-sm">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Domains */}
      <section className="px-4 py-16 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-100">4 Assessment Domains</h2>
            <p className="text-sm text-zinc-500 mt-2">
              Weighted by investment risk impact
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(({ Icon, title, desc, weight, color, bg }) => (
              <div
                key={title}
                className={`border rounded-xl p-5 space-y-3 ${bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className={`font-semibold text-sm ${color}`}>{title}</span>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono">{weight} weight</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 py-16 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-100">What you get</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                Icon: BarChart3,
                title: "Composite Risk Score",
                desc: "A 0-100 score with a radial gauge and radar chart across all 4 domains.",
              },
              {
                Icon: AlertTriangle,
                title: "Risk Flags",
                desc: "Specific investor-relevant risks that could block your next funding round.",
              },
              {
                Icon: CheckCircle2,
                title: "Strengths Identified",
                desc: "Security wins to highlight during due diligence conversations.",
              },
              {
                Icon: TrendingUp,
                title: "Priority Action Plan",
                desc: "Ranked remediation steps sorted by severity with effort estimates.",
              },
              {
                Icon: Zap,
                title: "AI Executive Summary",
                desc: "VC-style analysis of your posture contextualized to your stage and team size.",
              },
              {
                Icon: ShieldCheck,
                title: "Investability Verdict",
                desc: "Clear verdict from Critical Risk to Exemplary with rationale.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-2">
                <Icon className="w-4 h-4 text-teal-400" />
                <h3 className="font-semibold text-sm text-zinc-200">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-bold text-zinc-100">
            Ready to see your risk score?
          </h2>
          <p className="text-zinc-500">
            Identify and fix security gaps before investor due diligence catches them first.
          </p>
          <Link href="/assessment">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-10 mt-2">
              Start Your Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-zinc-700">Free · No signup · Results in minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="text-sm text-zinc-600">AIventureLens</span>
          </div>
          <p className="text-xs text-zinc-700">
            Powered by Claude AI · For informational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
