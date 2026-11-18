"use client";

import SiteHero from "./SiteHero";
import type { HeroSlide } from "@/lib/hero-slides";
import { FormEvent, useId, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import Link from "next/link";
import SiteButton from "./SiteButton";
import ConsentGate from "./ConsentGate";
import type { Locale } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";
import "./ContactPage.css";

const SHOP_EMAIL = SITE_CONTACT_EMAIL;
const SHOP_PHONE_DISPLAY = "+49 (0) 7141/2996700";
const SHOP_PHONE_TEL = "+4971412996700";
const SHOW_CONTACT_FAQ = true;
const SHOP_ADDRESS = "Daimlerstraße 13, 71691 Freiberg am Neckar";
const SHOP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SHOP_ADDRESS)}`;

// Draft answers avoid promising unconfirmed tolerances, lead times or file formats.
const FAQS = [
  {
    question: ["Welche Toleranzen können Sie einhalten?", "What tolerances can you achieve?"],
    answer: ["Die geeigneten Toleranzen hängen von Geometrie, Materialaufbau und Einsatzzweck ab. Senden Sie uns Ihre Anforderungen, damit wir die Machbarkeit und das passende Prüfverfahren gemeinsam klären können.", "Suitable tolerances depend on geometry, material construction and intended use. Send us your requirements so we can review feasibility and the appropriate inspection process together."],
  },
  {
    question: ["Können Sie CAD-Daten verarbeiten?", "Can you work with CAD data?"],
    answer: ["CAD-Konstruktion gehört zu unserem Prozess. Teilen Sie uns mit, welche Daten vorliegen. Dateiformat und den Austausch vertraulicher Modelle stimmen wir direkt mit Ihnen ab.", "CAD design is part of our process. Let us know what data you have. We will agree on the file format and a way to exchange confidential models with you directly."],
  },
  {
    question: ["Bieten Sie auch Kleinserienfertigung an?", "Do you offer small-series production?"],
    answer: ["Ja. Wir entwickeln und fertigen Unikate und Kleinserien. Für eine Einschätzung benötigen wir Informationen zum Bauteil, zur gewünschten Stückzahl und zum Einsatzbereich.", "Yes. We develop and manufacture one-off components and small series. To assess your project, we need information about the component, desired quantity and application."],
  },
  {
    question: ["Wie lange dauert ein typisches Projekt?", "How long does a typical project take?"],
    answer: ["Der Zeitplan hängt unter anderem vom Entwicklungsstand, vom Werkzeugbau, von der Stückzahl und von den Prüfanforderungen ab. Nennen Sie uns Ihren Wunschtermin, damit wir einen realistischen Ablauf abstimmen können.", "Timing depends on the development stage, tooling, quantities and inspection requirements. Share your preferred delivery date so we can agree on a realistic schedule."],
  },
  {
    question: ["Welche Materialien verarbeiten Sie?", "What materials do you work with?"],
    answer: ["Unser Schwerpunkt liegt auf kohlefaserverstärkten Kunststoffen und der Verarbeitung von Prepreg-Materialien. Die konkrete Materialauswahl richten wir nach Belastung, Gewicht und Einsatzbedingungen Ihres Bauteils aus.", "Our focus is carbon-fibre-reinforced polymers and prepreg materials. The specific material is selected according to the loads, weight and operating conditions of your component."],
  },
] as const;

function ContactFaq({ locale }: { locale: Locale }) {
  const language = locale === "en" ? 1 : 0;
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul>
      {FAQS.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-faq-${index}`;
        return (
          <li key={item.question[0]} className={expanded ? "is-open" : undefined}>
            <button
              type="button"
              className="contact-faq__question"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span>{item.question[language]}</span>
              <span className="contact-faq__mark" aria-hidden="true" />
            </button>
            <div className="contact-faq__panel" id={panelId} role="region" aria-hidden={!expanded}>
              <div className="contact-faq__panel-inner">
                <p>{item.answer[language]}</p>
              </div>
            </div>
            <span className="contact-faq__rule" aria-hidden="true" />
          </li>
        );
      })}
    </ul>
  );
}

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function ContactForm({ locale }: { locale: Locale }) {
  const t = (de: string, en: string) => locale === "en" ? en : de;
  const privacyHref = localizedHref("/datenschutz", locale);
  const formId = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [note, setNote] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: FieldErrors = {};
    if (name.length < 2) next.name = t("Bitte Namen angeben.", "Please enter your name.");
    if (!isEmail(email)) next.email = t("Bitte eine gültige E-Mail angeben.", "Please enter a valid email address.");
    if (message.length < 10) next.message = t("Bitte Ihr Anliegen etwas genauer beschreiben.", "Please describe your inquiry in a little more detail.");

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setNote(null);
      const firstInvalid = event.currentTarget.elements.namedItem(Object.keys(next)[0]);
      if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      return;
    }

    const lines = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      subject ? `Betreff: ${subject}` : null,
      "",
      message,
    ].filter((line): line is string => line !== null);

    window.location.href = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(
      subject || t("Projektanfrage", "Project inquiry")
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setNote(
      locale === "en"
        ? "Your mail app should open. If it does not, email us directly."
        : "Ihr E-Mail-Programm sollte sich öffnen. Falls nicht, schreiben Sie uns direkt.",
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={`${formId}-name`}>
            NAME <span className="text-brand-neon" aria-hidden>*</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("Ihr Name", "Your name")}
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
          <label htmlFor={`${formId}-email`}>
            E-MAIL <span className="text-brand-neon" aria-hidden>*</span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("name@unternehmen.de", "name@company.com")}
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
          <label htmlFor={`${formId}-phone`}>{t("TELEFON", "PHONE")}</label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+49 000 000 000"
          />
        </div>
        <div className="contact-field">
          <label htmlFor={`${formId}-subject`}>{t("BETREFF", "SUBJECT")}</label>
          <input
            id={`${formId}-subject`}
            name="subject"
            type="text"
            placeholder={t("Projektanfrage / Serienbau", "Project inquiry / Series production")}
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor={`${formId}-message`}>
          {t("NACHRICHT", "MESSAGE")} <span className="text-brand-neon" aria-hidden>*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          placeholder={t("Beschreiben Sie Ihr Projekt, Ihre Toleranzen, Stückzahlen und den gewünschten Zeitplan.", "Describe your project, tolerances, quantities and preferred timeline.")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${formId}-message-err` : undefined}
        />
        {errors.message ? (
          <p id={`${formId}-message-err`} className="contact-field__error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <p className="contact-form__hint font-mono text-[9px] uppercase tracking-wide text-zinc-500">
        {locale === "en" ? "Fields marked * are required." : "Mit * markierte Felder sind Pflichtfelder."}
      </p>
      <p className="contact-form__privacy mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        {locale === "en" ? "We process your data to handle your request. See our " : "Wir verarbeiten Ihre Angaben zur Bearbeitung der Anfrage. Details in der "}
        <Link className="text-brand-neon underline-offset-2 hover:underline" href={privacyHref}>
          {locale === "en" ? "privacy policy" : "Datenschutzerklärung"}
        </Link>
        .
      </p>
      <p className="contact-form__delivery">{t("Das Formular öffnet Ihr E-Mail-Programm mit Ihrer Anfrage. Dort können Sie die Nachricht prüfen und senden.", "This form opens your email app with your inquiry. You can review and send the message there.")}</p>
      <SiteButton type="submit">
        {t("E-Mail vorbereiten", "Prepare email")}
      </SiteButton>
      {note ? <p className="contact-form__note" role="status" aria-live="polite">{note}</p> : null}
    </form>
  );
}

function ContactMapPin({ locale }: { locale: Locale }) {
  const t = (de: string, en: string) => locale === "en" ? en : de;
  const cardId = useId();
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(SHOP_ADDRESS);
      ok = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = SHOP_ADDRESS;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      ok = document.execCommand("copy");
      field.remove();
    }
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="contact-map__pin">
      <div className="contact-map__pin-card" id={cardId}>
        <p>Daimlerstraße 13</p>
        <p>71691 Freiberg am Neckar</p>
        <div className="contact-map__pin-actions">
          <a href={SHOP_DIRECTIONS} target="_blank" rel="noopener noreferrer">
            Route
          </a>
          <button type="button" onClick={copyAddress}>
            {copied ? t("Kopiert", "Copied") : t("Kopieren", "Copy")}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? t("Adresse in die Zwischenablage kopiert.", "Address copied to clipboard.") : ""}
          </span>
        </div>
      </div>
      <span className="contact-map__pin-mark" aria-hidden="true">
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <path
            d="M14 35C14 35 3 20.2 3 13.2C3 7.03 7.92 2 14 2C20.08 2 25 7.03 25 13.2C25 20.2 14 35 14 35Z"
            fill="#0b0b0c"
            stroke="#00ff00"
            strokeWidth="1.6"
          />
          <circle cx="14" cy="13" r="3.4" fill="#00ff00" />
        </svg>
      </span>
    </div>
  );
}

export default function ContactPage({ locale = "de", heroSlide }: { locale?: Locale; heroSlide: HeroSlide }) {
  const t = (de: string, en: string) => locale === "en" ? en : de;
  return (
    <LazyMotion features={domAnimation}>
      <div className="contact-page">
        <SiteChrome />

        <main id="main-content" lang={locale}>
        <SiteHero slide={heroSlide} locale={locale} scrollTarget="#anfrage"
          title={t("KONTAKT", "CONTACT")}
          description={t("Haben Sie ein Projekt? Ob Motorsport-Prototyp oder Kleinserie, wir freuen uns auf Ihre Anfrage.", "Have a project in mind? From motorsport prototypes to small production runs, we look forward to hearing from you.")} />

        <div className="contact-body">
          <section id="anfrage" className="contact-split">
            <div className="contact-form-side">
              <header className="contact-section-head">
                <p>{">> START_PROJECT_MANIFEST"}</p>
                <h2 className="section-heading">{t("PROJEKTANFRAGE STARTEN", "START A PROJECT INQUIRY")}</h2>
              </header>
              <ContactForm locale={locale} />
            </div>

            <aside className="contact-info" aria-label={t("Direkter Kontakt", "Direct contact")}>
              <header className="contact-section-head">
                <p>{"// DIRECT_CONTACT_DETAILS"}</p>
                <h2 className="section-heading">{t("DIREKTER KONTAKT", "DIRECT CONTACT")}</h2>
              </header>
              <div className="contact-info__blocks">
                <div>
                  <p className="contact-info__kicker">{t("UNSERE HAUPTSTELLE", "OUR HEADQUARTERS")}</p>
                  <p className="contact-info__value">HEADQUARTERS</p>
                  <p className="contact-info__address">
                    <span>Bräutigam GmbH</span>
                    <span>Daimlerstraße 13</span>
                    <span>71691 Freiberg am Neckar</span>
                    <span>{t("Deutschland", "Germany")}</span>
                  </p>
                </div>
                <div>
                  <p className="contact-info__kicker">{t("TELEFONISCHER SUPPORT", "BY PHONE")}</p>
                  <a className="contact-info__value" href={`tel:${SHOP_PHONE_TEL}`}>
                    {SHOP_PHONE_DISPLAY}
                  </a>
                  <p className="contact-info__hours">{t("Mo - Fr: 08:00 - 18:00 Uhr (CET)", "Mon–Fri: 08:00–18:00 (Central European Time)")}</p>
                </div>
                <div>
                  <p className="contact-info__kicker">E-Mail</p>
                  <a className="contact-info__value" href={`mailto:${SHOP_EMAIL}`}>
                    {SHOP_EMAIL.toUpperCase()}
                  </a>
                </div>
              </div>
              <div className="contact-shield">
                <p>{t("VERTRAULICHE PROJEKTDATEN", "CONFIDENTIAL PROJECT DATA")}</p>
                <p>
                  {t("Für vertrauliche Zeichnungen und CAD-Daten stimmen wir den Datenaustausch direkt mit Ihnen ab.", "For confidential drawings and CAD files, we arrange data exchange with you directly.")}
                </p>
              </div>
            </aside>
          </section>

          {SHOW_CONTACT_FAQ ? (
            <section className="contact-faq" aria-label={t("Häufig gestellte Fragen", "Frequently asked questions")}>
              <header className="contact-faq__head">
                <p>{"// FAQ_ENGINEERING_ANSWERS"}</p>
                <h2 className="section-heading">
                  <span>{t("HÄUFIG", "FREQUENTLY")}</span>
                  <span>{t("GESTELLTE FRAGEN.", "ASKED QUESTIONS.")}</span>
                </h2>
              </header>
              <ContactFaq locale={locale} />
            </section>
          ) : null}

          <section className="contact-map" aria-label={t("Standort", "Location")}>
            <header>
              <div>
                <p>{">>_TARGET_GEOLOCATION"}</p>
                <h2 className="section-heading">{t("UNSER STANDORT", "OUR LOCATION")}</h2>
              </div>
              <p>AXIS_X: +1.28 AXIS_Y: -0.49 AXIS_Z: +0.00</p>
            </header>
            <div className="contact-map__frame">
              <ConsentGate
                kind="map"
                locale={locale}
                loadLabelDe="Karte laden"
                loadLabelEn="Load map"
              >
                <iframe
                  title="Karte: Daimlerstraße 13, 71691 Freiberg am Neckar"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=9.1973%2C48.9276%2C9.2093%2C48.9316&layer=mapnik"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </ConsentGate>
              <ContactMapPin locale={locale} />
            </div>
          </section>
        </div>
        </main>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
