import type { Metadata } from "next";
import HomePage from "./components/HomePage";
import { pageTitle } from "@/lib/site-nav";
export const metadata: Metadata = {
  title: pageTitle("Start"),
  description:
    "Bräutigam GmbH — Premium-Carbon in Freiberg am Neckar für Motorsport und Serienfertigung.",
  alternates: { languages: { de: "/", en: "/en" } },
};

/**
 * Server entry — keeps metadata/layout on the server and mounts a single
 * client island for the interactive page. Theme lives on <html class="dark">
 * so static markup can still theme via CSS without prop drilling.
 */
export default function Page() {
  return <HomePage />;
}
