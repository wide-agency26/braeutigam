"use client";

import { useState, type ReactNode } from "react";

type ConsentGateProps = {
  kind: "youtube" | "map";
  loadLabelDe: string;
  loadLabelEn: string;
  poster?: ReactNode;
  locale?: "de" | "en";
  children: ReactNode;
};

/**
 * Blocks third-party iframes until the visitor opts in (YouTube, OpenStreetMap).
 */
export default function ConsentGate({
  kind,
  loadLabelDe,
  loadLabelEn,
  poster,
  locale = "de",
  children,
}: ConsentGateProps) {
  const [allowed, setAllowed] = useState(false);
  const label = locale === "en" ? loadLabelEn : loadLabelDe;

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative flex min-h-[280px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-zinc-300 bg-zinc-100/80 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/60"
      data-consent-kind={kind}
    >
      {poster}
      <p className="max-w-md font-sans text-sm text-zinc-600 dark:text-zinc-400">
        {locale === "en"
          ? "External content loads only after you confirm."
          : "Externe Inhalte werden erst nach Ihrer Bestätigung geladen."}
      </p>
      <button
        type="button"
        className="copy-body-sm text-brand-neon underline-offset-4 hover:underline"
        onClick={() => setAllowed(true)}
      >
        {label}
      </button>
    </div>
  );
}
