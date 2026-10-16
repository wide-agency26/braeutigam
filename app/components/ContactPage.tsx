"use client";

import { FormEvent, useId, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import "./ContactPage.css";

const SHOP_EMAIL = "info@braeutigam.de";
const SHOP_PHONE_DISPLAY = "+49 (0) 7141/2996700";
const SHOP_PHONE_TEL = "+4971412996700";

const FAQS = [
  "Welche Toleranzen können Sie einhalten?",
  "Können Sie CAD-Daten verarbeiten?",
  "Bieten Sie auch Kleinserienfertigung an?",
  "Wie lange dauert ein typisches Projekt?",
  "Welche Materialien verarbeiten Sie?",
] as const;

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

      <button className="site-btn" type="submit">
        Anfrage senden
      </button>
      {note ? <p className="contact-form__note">{note}</p> : null}
    </form>
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
                    <span>70173 Stuttgart</span>
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

          <section className="contact-faq" aria-label="Häufig gestellte Fragen">
            <header className="contact-faq__head">
              <p>{"// FAQ_ENGINEERING_ANSWERS"}</p>
              <h2>
                <span>HÄUFIG</span>
                <span>GESTELLTE FRAGEN.</span>
              </h2>
            </header>
            <ul>
              {FAQS.map((question) => (
                <li key={question}>
                  <p>{question}</p>
                  <span className="contact-faq__rule" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </section>

          <section className="contact-map" aria-label="Standort">
            <header>
              <div>
                <p>{">>_TARGET_GEOLOCATION"}</p>
                <h2>UNSER STANDORT</h2>
              </div>
              <p>AXIS_X: +1.28 AXIS_Y: -0.49 AXIS_Z: +0.00</p>
            </header>
            <div className="contact-map__frame">
              <img src="/images/contact/map.png" alt="Karte mit dem Standort Bräutigam bei Ludwigsburg" />
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
