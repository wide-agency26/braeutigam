import type { Metadata } from "next";
import ContactPage from "../components/ContactPage";

export const metadata: Metadata = {
  title: "Kontakt | Bräutigam GmbH",
  description:
    "Haben Sie ein Projekt? Ob Formula 1 Prototyp oder Kleinserie, wir freuen uns auf Ihre Anfrage. Bräutigam GmbH, Daimlerstraße 13, 71691 Freiberg am Neckar.",
};

export default function Page() {
  return <ContactPage />;
}
