"use client";

import { FormEvent, useId, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteButton from "./SiteButton";
import "./ContactPage.css";

const SHOP_EMAIL = "info@braeutigam.de";
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
              className="contact-faq__question"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span>{item.question}</span>
              <span className="contact-faq__mark" aria-hidden="true" />
            </button>
            <div className="contact-faq__panel" id={panelId} role="region" aria-hidden={!expanded}>
              <div className="contact-faq__panel-inner">
                <p>{item.answer}</p>
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

function ContactForm() {
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
    setNote("Ihr E-Mail-Programm sollte sich öffnen. Falls nicht, schreiben Sie direkt an info@braeutigam.de.");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={`${formId}-name`}>NAME</label>
          <input
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
            <p id={`${formId}-name-err`} className="contact-field__error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="contact-field">
          <label htmlFor={`${formId}-email`}>E-MAIL</label>
          <input
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
            <p id={`${formId}-email-err`} className="contact-field__error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-field">
          <label htmlFor={`${formId}-phone`}>TELEFON</label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+49 000 000 000"
          />
        </div>
        <div className="contact-field">
          <label htmlFor={`${formId}-subject`}>BETREFF</label>
          <input
            id={`${formId}-subject`}
            name="subject"
            type="text"
            placeholder="Projektanfrage / Serienbau"
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor={`${formId}-message`}>NACHRICHT</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          placeholder="Beschreiben Sie Ihr Projekt, Ihre Toleranzen, Stückzahlen und den gewünschten Zeitplan."
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${formId}-message-err` : undefined}
        />
        {errors.message ? (
          <p id={`${formId}-message-err`} className="contact-field__error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <SiteButton type="submit">Anfrage senden</SiteButton>
      {note ? <p className="contact-form__note">{note}</p> : null}
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
        <p>Daimlerstraße 13</p>
        <p>71691 Freiberg am Neckar</p>
        <div className="contact-map__pin-actions">
          <a href={SHOP_DIRECTIONS} target="_blank" rel="noopener noreferrer">
            Route
          </a>
          <button type="button" onClick={copyAddress}>
            {copied ? "Kopiert" : "Kopieren"}
          </button>
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

export default function ContactPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="contact-page">
        <SiteChrome />

        <section className="contact-hero" aria-label="Kontakt">
          <div className="contact-hero__media" aria-hidden="true">
            <img className="contact-photo--hero" src="/images/contact/hero.png" alt="" />
          </div>
          <div className="contact-hero__shade" aria-hidden="true" />

          <p className="contact-hero__portal">
            <span>PORTAL [48.9298° N, 9.2070° E]</span>
            <span>STATUS: ONLINE // READY FOR UPLOAD</span>
            <span>INCOMING INQUIRIES ROUTED VIA SSL</span>
          </p>
          <p className="contact-hero__build">
            <span>CONTACT INTERFACE v2.4</span>
            <span>UPDATE 2026 // CERTIFIED CFRP</span>
          </p>

          <div className="contact-hero__title">
            <h1>Kontakt</h1>
            <p>Haben Sie ein Projekt? Ob Formula 1 Prototyp oder Kleinserie, wir freuen uns auf Ihre Anfrage.</p>
          </div>

          <a className="contact-hero__status" href="#anfrage">
            <span>PROJECT STATUS: NOMINAL // VEHICLE_BR_CHASSIS</span>
            <span>SCROLL TO EXPLORE</span>
          </a>
        </section>

        <div className="contact-body">
          <section id="anfrage" className="contact-split">
            <div className="contact-form-side">
              <header className="contact-section-head">
                <p>{">> START_PROJECT_MANIFEST"}</p>
                <h2>PROJEKTANFRAGE STARTEN</h2>
              </header>
              <ContactForm />
            </div>

            <aside className="contact-info" aria-label="Direkter Kontakt">
              <header className="contact-section-head">
                <p>{"// DIRECT_CONTACT_DETAILS"}</p>
                <h2>DIREKTER KONTAKT</h2>
              </header>
              <div className="contact-info__blocks">
                <div>
                  <p className="contact-info__kicker">UNSERE HAUPTSTELLE</p>
                  <p className="contact-info__value">HEADQUARTERS</p>
                  <p className="contact-info__address">
                    <span>Bräutigam GmbH</span>
                    <span>Daimlerstraße 13</span>
                    <span>71691 Freiberg am Neckar</span>
                    <span>Deutschland</span>
                  </p>
                </div>
                <div>
                  <p className="contact-info__kicker">TELEFONISCHER SUPPORT</p>
                  <a className="contact-info__value" href={`tel:${SHOP_PHONE_TEL}`}>
                    {SHOP_PHONE_DISPLAY}
                  </a>
                  <p className="contact-info__hours">Mo - Fr: 08:00 - 18:00 Uhr (CET)</p>
                </div>
                <div>
                  <p className="contact-info__kicker">E-Mail</p>
                  <a className="contact-info__value" href={`mailto:${SHOP_EMAIL}`}>
                    INFO@BRAEUTIGAM.DE
                  </a>
                </div>
              </div>
              <div className="contact-shield">
                <p>SSL_ENCRYPTED_PORTAL // SECURE</p>
                <p>
                  Sämtliche Zeichnungsdaten und CAD-Modelle werden nach ISO 27001 auf redundanten,
                  lokalen Servern gesichert.
                </p>
              </div>
            </aside>
          </section>

          {SHOW_CONTACT_FAQ ? (
            <section className="contact-faq" aria-label="Häufig gestellte Fragen">
              <header className="contact-faq__head">
                <p>{"// FAQ_ENGINEERING_ANSWERS"}</p>
                <h2>
                  <span>HÄUFIG</span>
                  <span>GESTELLTE FRAGEN.</span>
                </h2>
              </header>
              <ContactFaq />
            </section>
          ) : null}

          <section className="contact-map" aria-label="Standort">
            <header>
              <div>
                <p>{">>_TARGET_GEOLOCATION"}</p>
                <h2>UNSER STANDORT</h2>
              </div>
              <p>AXIS_X: +1.28 AXIS_Y: -0.49 AXIS_Z: +0.00</p>
            </header>
            <div className="contact-map__frame">
              <iframe
                title="Karte: Daimlerstraße 13, 71691 Freiberg am Neckar"
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.1973%2C48.9276%2C9.2093%2C48.9316&layer=mapnik"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <ContactMapPin />
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
