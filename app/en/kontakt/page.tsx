import type { Metadata } from "next";
import ContactPage from "../../components/ContactPage";
import { pageTitleForLocale } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitleForLocale("Kontakt", "en"),
  description:
    "Project inquiry for Bräutigam GmbH, Daimlerstraße 13, 71691 Freiberg am Neckar, Germany.",
  alternates: { languages: { de: "/kontakt", en: "/en/kontakt" } },
};

export default function Page() {
  return <ContactPage locale="en" />;
}
