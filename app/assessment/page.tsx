import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";
import { ExpiredBanner } from "@/components/assessment/ExpiredBanner";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Assessment — AIventureLens",
  description: "Complete your security and operational risk assessment",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-teal-600/20 border border-teal-700/50 flex items-center justify-center group-hover:bg-teal-600/30 transition-colors">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
              AIventureLens
            </span>
          </Link>
          <span className="text-xs text-zinc-600">
            32 questions · ~8 min
          </span>
        </div>

        <ExpiredBanner />

        {/* Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <AssessmentWizard />
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          Your responses are used only for analysis. No data is stored on our servers.
        </p>
      </div>
    </div>
  );
}
