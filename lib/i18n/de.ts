import type { ApplyDictionary, ChromeDictionary, JobDetailDictionary } from "./types";

export const chromeDe: ChromeDictionary = {
  skipLink: "Zum Hauptinhalt",
  menuToggle: "Navigation öffnen",
  home: "Startseite",
  theme: "Farbmodus wechseln",
};

export const applyDe: ApplyDictionary = {
  received: "Eingegangen",
  successTitle: "Deine Bewerbung ist bei uns",
  successBody: (jobTitle) =>
    `Wir haben deine Unterlagen für „${jobTitle}“ gespeichert. Jede Bewerbung wird gelesen.`,
  eyebrow: "Bewerbung",
  title: "Deine Unterlagen senden",
  firstName: "Vorname",
  lastName: "Nachname",
  email: "E-Mail",
  phone: "Telefon",
  coverLetter: "Anschreiben",
  recommended: "Ich wurde empfohlen",
  recommender: "Name der Person, die mich empfohlen hat",
  resume: "Lebenslauf (PDF oder Word, max. 4 MB)",
  submit: "Bewerbung absenden",
  submitting: "Wird gesendet …",
};

export const jobDetailDe: JobDetailDictionary = {
  role: "Rolle",
  requirements: "Anforderungen",
  allOpenings: "← Alle Stellen",
  location: "STANDORT",
};
