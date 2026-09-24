"use client";

import { FormEvent, useId, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteHero from "./SiteHero";
import "./ContactPage.css";

const SHOP_EMAIL = "info@braeutigam-gmbh.eu";
const SHOP_PHONE_DISPLAY = "+49 (0) 7141 2996-700";
const SHOP_PHONE_TEL = "+4971412996700";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Daimlerstra%C3%9Fe+13+71691+Freiberg+am+Neckar";

const TOPICS = [
  { value: "Projektanfrage", label: "Projektanfrage" },
  { value: "Kleinserie", label: "Kleinserie / Fertigung" },
  { value: "Presse", label: "Presse / Medien" },
  { value: "Allgemein", label: "Allgemeine Frage" },
] as const;

const FAQS = [
  {
    q: "Wie starte ich eine Projektanfrage?",
    a: (
      <>
        Schicken Sie CAD-Daten oder Zeichnung, geplante Stückzahl und den Einsatz
        (Rennen, Homologation, Kleinserie). Wir prüfen Machbarkeit im Haus und
        melden den nächsten Schritt.
      </>
    ),
  },
  {
    q: "Wo wird gefertigt?",
    a: (
      <>
        In Freiberg am Neckar, Daimlerstraße 13. Laminieren, CNC, Autoklav und
        Qualitätssicherung laufen in-house. Eine Anfahrtsskizze liegt unter der
        Adresse oben.
      </>
    ),
  },
  {
    q: "Wer ist der richtige Ansprechpartner?",
    a: (
      <>
        Für neue Programme schreiben Sie an{" "}
        <a href={`mailto:${SHOP_EMAIL}`}>{SHOP_EMAIL}</a>. Laufende Fertigung
        erreichen Sie über die Projektleiter unter{" "}
        <a href="/#datasheet">Team</a> auf der Startseite.
      </>
    ),
  },
  {
    q: "Kann ich mich bewerben?",
    a: (
      <>
        Offene Stellen und Initiativbewerbungen liegen auf der{" "}
        <a href="/karriere">Karriere-Seite</a>. Bitte nicht über dieses Formular
        senden.
      </>
    ),
  },
] as const;

type FieldErrors = Partial<
  Record<"name" | "email" | "topic" | "message" | "consent", string>
>;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function ContactForm() {
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [note, setNote] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const consent = data.get("consent") === "on";

    const next: FieldErrors = {};
    if (name.length < 2) next.name = "Bitte Namen angeben.";
    if (!isEmail(email)) next.email = "Bitte eine gültige E-Mail angeben.";
    if (!topic) next.topic = "Bitte ein Thema wählen.";
    if (message.length < 20) next.message = "Bitte Ihr Anliegen etwas genauer beschreiben.";
    if (!consent) next.consent = "Bitte die Nutzung der Angaben bestätigen.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setNote(null);
      return;
    }

    const lines = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      company ? `Firma: ${company}` : null,
      `Thema: ${topic}`,
      "",
      message,
    ].filter((line): line is string => line !== null);

    const href = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(
      `Kontakt: ${topic}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;

    window.location.href = href;
    setNote(
      "Ihr E-Mail-Programm sollte sich öffnen. Falls nicht, schreiben Sie direkt an info@braeutigam-gmbh.eu."
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2 className="contact-heading">Nachricht</h2>

      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? `${formId}-name-err` : undefined}
          />
          {errors.name ? (
            <p id={`${formId}-name-err`} className="contact-field__error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="contact-field">
          <label htmlFor={`${formId}-email`}>E-Mail</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? `${formId}-email-err` : undefined}
          />
          {errors.email ? (
            <p id={`${formId}-email-err`} className="contact-field__error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={`${formId}-company`}>Firma (optional)</label>
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
          />
        </div>
        <div className="contact-field">
          <label htmlFor={`${formId}-topic`}>Thema</label>
          <select
            id={`${formId}-topic`}
            name="topic"
            required
            defaultValue=""
            aria-invalid={errors.topic ? "true" : undefined}
            aria-describedby={errors.topic ? `${formId}-topic-err` : undefined}
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
          {errors.topic ? (
            <p id={`${formId}-topic-err`} className="contact-field__error">
              {errors.topic}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor={`${formId}-message`}>Nachricht</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${formId}-message-err` : undefined}
        />
        {errors.message ? (
          <p id={`${formId}-message-err`} className="contact-field__error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <label
        className="contact-consent"
        data-invalid={errors.consent ? "true" : undefined}
      >
        <input id={`${formId}-consent`} name="consent" type="checkbox" />
        <span>
          Ich bin einverstanden, dass Bräutigam GmbH diese Angaben nutzt, um auf
          meine Anfrage zu antworten.
        </span>
      </label>
      {errors.consent ? (
        <p id={`${formId}-consent-err`} className="contact-field__error">
          {errors.consent}
        </p>
      ) : null}

      <button className="contact-submit" type="submit">
        Nachricht senden
      </button>
      {note ? (
        <p className="contact-form__note" data-tone="ok">
          {note}
        </p>
      ) : (
        <p className="contact-form__note">
          Öffnet Ihr E-Mail-Programm mit der vorausgefüllten Nachricht.
        </p>
      )}
    </form>
  );
}

export default function ContactPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="contact relative min-h-[100dvh] bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        <div className="noise-overlay pointer-events-none" />

        <SiteChrome />
        <SiteHero scrollTarget="#kontakt" priority={false} isPageHeading={false} />

        <section id="kontakt" className="relative overflow-hidden py-24 md:py-32">
          <div className="contact-shell relative">
            <p
              className="contact-watermark absolute -top-10 left-[8%] text-[clamp(3rem,11vw,10rem)] md:-top-4 md:left-[32%]"
              aria-hidden="true"
            >
              CONTACT
            </p>

            <div className="relative z-10 max-w-3xl pt-[clamp(3rem,9vw,7rem)]">
              <h1 className="contact-heading">
                <span className="block text-[var(--contact-neon)]">Kontakt</span>
                Direkter Draht in die Fertigung
              </h1>
              <p className="contact-lede">
                Carbon-Bauteile für den Motorsport. Schreiben Sie uns zu
                Machbarkeit, Kleinserie oder einem laufenden Programm.
              </p>
            </div>
          </div>
        </section>

        <section className="cv-auto relative pb-20 md:pb-28">
          <div className="contact-shell">
            <div className="contact-split">
              <div>
                <a className="contact-email" href={`mailto:${SHOP_EMAIL}`}>
                  {SHOP_EMAIL}
                </a>
                <a className="contact-phone" href={`tel:${SHOP_PHONE_TEL}`}>
                  {SHOP_PHONE_DISPLAY}
                </a>
                <p className="contact-address">
                  Bräutigam GmbH
                  <br />
                  Daimlerstraße 13
                  <br />
                  71691 Freiberg am Neckar
                  <br />
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Route öffnen
                  </a>
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        <section className="cv-auto relative pb-28 md:pb-40">
          <div className="contact-shell">
            <h2 className="contact-heading">Häufige Fragen</h2>
            <p className="contact-lede contact-lede--faq">
              Kurz, bevor Sie schreiben. Bewerbungen gehören auf die
              Karriere-Seite.
            </p>

            <div className="contact-faq">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>
                    <h3>{item.q}</h3>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
