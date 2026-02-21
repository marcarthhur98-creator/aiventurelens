"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";

function BannerContent() {
  const params = useSearchParams();
  if (params.get("expired") !== "true") return null;

  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-amber-400 bg-amber-950/30 border border-amber-900 rounded-lg px-4 py-3">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      Your previous session expired. Please complete the assessment again to view results.
    </div>
  );
}

export function ExpiredBanner() {
  return (
    <Suspense fallback={null}>
      <BannerContent />
    </Suspense>
  );
}
