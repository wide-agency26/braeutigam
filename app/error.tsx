"use client";

import Link from "next/link";
import { useSiteLocale } from "@/lib/i18n/use-locale";

export default function ErrorPage({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  const english = useSiteLocale() === "en";
  return <main id="main-content" className="site-container flex min-h-[70svh] flex-col items-start justify-center gap-6 py-24">
    <p className="font-mono text-sm">BRÄUTIGAM</p>
    <h1 className="text-4xl">{english ? "This page could not load." : "Diese Seite konnte nicht geladen werden."}</h1>
    <p>{english ? "Please try again in a moment." : "Bitte versuchen Sie es gleich noch einmal."}</p>
    <button type="button" className="border border-current px-6 py-3" onClick={unstable_retry}>{english ? "Try again" : "Erneut versuchen"}</button>
    <Link className="underline" href={english ? "/en" : "/"}>{english ? "Back to Home" : "Zur Startseite"}</Link>
  </main>;
}
