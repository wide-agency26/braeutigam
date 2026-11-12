import { publicVideos } from "@/lib/content/public";
export const revalidate = 60;
import type { Metadata } from "next";
import ContactPage from "../components/ContactPage";

import { pageTitle } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: pageTitle("Kontakt"),
  description:
    "Haben Sie ein Projekt? Ob Formula 1 Prototyp oder Kleinserie, wir freuen uns auf Ihre Anfrage. Bräutigam GmbH, Daimlerstraße 13, 71691 Freiberg am Neckar.",
  alternates: { languages: { de: "/kontakt", en: "/en/kontakt" } },
};

export default async function Page() {
  const videos = await publicVideos("contact", "de");
  return <ContactPage video={videos[0]} />;
}
