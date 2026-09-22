import type { Metadata } from "next";
import ContactPage from "../components/ContactPage";

export const metadata: Metadata = {
  title: "Kontakt | Bräutigam GmbH",
  description:
    "Kontakt zur Bräutigam GmbH in Freiberg am Neckar. Carbonfaser-Bauteile für den Motorsport. Telefon +49 7141 2996-700, E-Mail info@braeutigam-gmbh.eu.",
};

export default function Page() {
  return <ContactPage />;
}
