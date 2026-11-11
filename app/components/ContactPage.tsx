"use client";

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
const SHOW_CONTACT_FAQ = false;
const SHOP_ADDRESS = "Daimlerstraße 13, 71691 Freiberg am Neckar";
const SHOP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SHOP_ADDRESS)}`;

const FAQS = [
  {
    question: "Welche Toleranzen können Sie einhalten?",
    answer:
      "Platzhalter. Hier folgt die Angabe zu den Toleranzen, die wir am Carbon-Bauteil und in der CNC-Prüfung einhalten.",
  },
  {
    question: "Können Sie CAD-Daten verarbeiten?",
    answer:
      "Platzhalter. Hier folgt, welche CAD-Formate wir annehmen und wie der Datenaustausch abläuft.",
  },
  {
    question: "Bieten Sie auch Kleinserienfertigung an?",
    answer:
      "Platzhalter. Hier folgt, ab welcher Stückzahl wir Kleinserien fertigen und wie der Ablauf aussieht.",
  },
  {
    question: "Wie lange dauert ein typisches Projekt?",
    answer:
      "Platzhalter. Hier folgt die typische Dauer von der Anfrage bis zum fertigen Bauteil.",
  },
  {
    question: "Welche Materialien verarbeiten Sie?",
    answer:
      "Platzhalter. Hier folgt die Übersicht der Werkstoffe, die wir in der Fertigung verarbeiten.",
  },
] as const;

function ContactFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul>
      {FAQS.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-faq-${index}`;
        return (
          <li key={item.question} className={expanded ? "is-open" : undefined}>
            <button
              type="button"
              className="contact-faq__question copy-body-lg"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span>{item.question}</span>
              <span className="contact-faq__mark" aria-hidden="true" />
            </button>
            <div className="contact-faq__panel" id={panelId} role="region" aria-hidden={!expanded}>
              <div className="contact-faq__panel-inner">
                <p className="copy-body">{item.answer}</p>
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
    if (name.length < 2) next.name = "Bitte Namen angeben.";
    if (!isEmail(email)) next.email = "Bitte eine gültige E-Mail angeben.";
    if (message.length < 10) next.message = "Bitte Ihr Anliegen etwas genauer beschreiben.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setNote(null);
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
      subject || "Projektanfrage"
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
          <label className="copy-caption" htmlFor={`${formId}-name`}>
            NAME <span className="text-brand-neon" aria-hidden>*</span>
          </label>
          <input
            className="copy-body"
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ihr Name"
            required
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? `${formId}-name-err` : undefined}
          />
          {errors.name ? (
            <p id={`${formId}-name-err`} className="contact-field__error copy-caption">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="contact-field">
          <label className="copy-caption" htmlFor={`${formId}-email`}>
            E-MAIL <span className="text-brand-neon" aria-hidden>*</span>
          </label>
          <input
            className="copy-body"
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@unternehmen.de"
            required
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? `${formId}-email-err` : undefined}
          />
          {errors.email ? (
            <p id={`${formId}-email-err`} className="contact-field__error copy-caption">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-field">
          <label className="copy-caption" htmlFor={`${formId}-phone`}>TELEFON</label>
          <input
            className="copy-body"
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+49 000 000 000"
          />
        </div>
        <div className="contact-field">
          <label className="copy-caption" htmlFor={`${formId}-subject`}>BETREFF</label>
          <input
            className="copy-body"
            id={`${formId}-subject`}
            name="subject"
            type="text"
            placeholder="Projektanfrage / Serienbau"
          />
        </div>
      </div>

      <div className="contact-field">
        <label className="copy-caption" htmlFor={`${formId}-message`}>
          NACHRICHT <span className="text-brand-neon" aria-hidden>*</span>
        </label>
        <textarea
          className="copy-body"
          id={`${formId}-message`}
          name="message"
          required
          placeholder="Beschreiben Sie Ihr Projekt, Ihre Toleranzen, Stückzahlen und den gewünschten Zeitplan."
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${formId}-message-err` : undefined}
        />
        {errors.message ? (
          <p id={`${formId}-message-err`} className="contact-field__error copy-caption">
            {errors.message}
          </p>
        ) : null}
      </div>

      <p className="contact-form__hint copy-tiny text-zinc-500">
        {locale === "en" ? "Fields marked * are required." : "Mit * markierte Felder sind Pflichtfelder."}
      </p>
      <p className="contact-form__privacy copy-caption mt-3 text-zinc-600 dark:text-zinc-400">
        {locale === "en" ? "We process your data to handle your request. See our " : "Wir verarbeiten Ihre Angaben zur Bearbeitung der Anfrage. Details in der "}
        <Link className="text-brand-neon underline-offset-2 hover:underline" href={privacyHref}>
          {locale === "en" ? "privacy policy" : "Datenschutzerklärung"}
        </Link>
        .
      </p>
      <SiteButton type="submit">
        {locale === "en" ? "Send inquiry" : "Anfrage senden"}
      </SiteButton>
      {note ? <p className="contact-form__note" role="status" aria-live="polite">{note}</p> : null}
    </form>
  );
}

function ContactMapPin() {
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
        <p className="copy-body-sm">Daimlerstraße 13</p>
        <p className="copy-body-sm">71691 Freiberg am Neckar</p>
        <div className="contact-map__pin-actions">
          <a className="copy-caption" href={SHOP_DIRECTIONS} target="_blank" rel="noopener noreferrer">
            Route
          </a>
          <button className="copy-caption" type="button" onClick={copyAddress}>
            {copied ? "Kopiert" : "Kopieren"}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? "Adresse in die Zwischenablage kopiert." : ""}
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

export default function ContactPage({ locale = "de" }: { locale?: Locale }) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="contact-page">
        <SiteChrome />

        <main id="main-content" lang={locale}>
        <section className="contact-hero" aria-label="Kontakt">
          <div className="contact-hero__media" aria-hidden="true">
            <img className="contact-photo--hero" src="/images/contact/hero.png" alt="" />
          </div>
          <div className="contact-hero__shade" aria-hidden="true" />

          <p className="contact-hero__portal copy-caption">
            <span>PORTAL [48.9298° N, 9.2070° E]</span>
            <span>STATUS: ONLINE // READY FOR UPLOAD</span>
            <span>INCOMING INQUIRIES ROUTED VIA SSL</span>
          </p>
          <p className="contact-hero__build copy-caption">
            <span>CONTACT INTERFACE v2.4</span>
            <span>UPDATE 2026 // CERTIFIED CFRP</span>
          </p>

          <div className="contact-hero__title">
            <h1 className="heading-primary-bold">Kontakt</h1>
            <p className="copy-body">Haben Sie ein Projekt? Ob Formula 1 Prototyp oder Kleinserie, wir freuen uns auf Ihre Anfrage.</p>
          </div>

          <a className="contact-hero__status copy-tiny" href="#anfrage">
            <span>PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS</span>
            <span className="copy-body-sm">SCROLL TO EXPLORE</span>
          </a>
        </section>

        <div className="contact-body">
          <section id="anfrage" className="contact-split">
            <div className="contact-form-side">
              <header className="contact-section-head">
                <p className="copy-caption">{">> START_PROJECT_MANIFEST"}</p>
                <h2 className="heading-tertiary">PROJEKTANFRAGE STARTEN</h2>
              </header>
              <ContactForm locale={locale} />
            </div>

            <aside className="contact-info" aria-label="Direkter Kontakt">
              <header className="contact-section-head">
                <p className="copy-caption">{"// DIRECT_CONTACT_DETAILS"}</p>
                <h2 className="heading-tertiary">DIREKTER KONTAKT</h2>
              </header>
              <div className="contact-info__blocks">
                <div>
                  <p className="contact-info__kicker copy-caption">UNSERE HAUPTSTELLE</p>
                  <p className="contact-info__value heading-tertiary">HEADQUARTERS</p>
                  <p className="contact-info__address copy-body">
                    <span>Bräutigam GmbH</span>
                    <span>Daimlerstraße 13</span>
                    <span>71691 Freiberg am Neckar</span>
                    <span>Deutschland</span>
                  </p>
                </div>
                <div>
                  <p className="contact-info__kicker copy-caption">TELEFONISCHER SUPPORT</p>
                  <a className="contact-info__value heading-tertiary" href={`tel:${SHOP_PHONE_TEL}`}>
                    {SHOP_PHONE_DISPLAY}
                  </a>
                  <p className="contact-info__hours copy-body-sm">Mo - Fr: 08:00 - 18:00 Uhr (CET)</p>
                </div>
                <div>
                  <p className="contact-info__kicker copy-caption">E-Mail</p>
                  <a className="contact-info__value heading-tertiary" href={`mailto:${SHOP_EMAIL}`}>
                    INFO@BRAEUTIGAM.DE
                  </a>
                </div>
              </div>
              <div className="contact-shield">
                <p className="copy-tiny">SSL_ENCRYPTED_PORTAL // SECURE</p>
                <p className="copy-body-sm">
                  Sämtliche Zeichnungsdaten und CAD-Modelle werden nach ISO 27001 auf redundanten,
                  lokalen Servern gesichert.
                </p>
              </div>
            </aside>
          </section>

          {SHOW_CONTACT_FAQ ? (
            <section className="contact-faq" aria-label="Häufig gestellte Fragen">
              <header className="contact-faq__head">
                <p className="copy-caption">{"// FAQ_ENGINEERING_ANSWERS"}</p>
                <h2>
                  <span className="heading-secondary-bold">HÄUFIG</span>
                  <span className="decorative-secondary">GESTELLTE FRAGEN.</span>
                </h2>
              </header>
              <ContactFaq />
            </section>
          ) : null}

          <section className="contact-map" aria-label="Standort">
            <header>
              <div>
                <p className="copy-caption">{">>_TARGET_GEOLOCATION"}</p>
                <h2 className="heading-secondary-bold">UNSER STANDORT</h2>
              </div>
              <p className="copy-caption">AXIS_X: +1.28 AXIS_Y: -0.49 AXIS_Z: +0.00</p>
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
              <ContactMapPin />
            </div>
          </section>
        </div>
        </main>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
