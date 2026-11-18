"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./components/SiteChrome";
import SiteButton from "./components/SiteButton";
import { localizedHref } from "@/lib/i18n";
import { useSiteLocale } from "@/lib/i18n/use-locale";
import "./not-found.css";

export default function NotFound() {
  const locale = useSiteLocale();
  const en = locale === "en";
  return (
    <LazyMotion features={domAnimation}>
      <SiteChrome />
      <main id="main-content" className="not-found-page" lang={locale}>
        <p className="copy-tiny">BRAEUTIGAM_WEBFILE / 404</p>
        <p className="not-found-code" aria-hidden="true">404</p>
        <h1 className="heading-secondary-bold">{en ? "Page not found." : "Seite nicht gefunden."}</h1>
        <p className="not-found-description">{en ? "This page may have moved, or the link is no longer valid. Explore our work or get in touch." : "Diese Seite wurde möglicherweise verschoben oder der Link ist nicht mehr gültig. Entdecken Sie unsere Arbeit oder nehmen Sie Kontakt auf."}</p>
        <div className="not-found-actions">
          <SiteButton href={localizedHref("/", locale)}>{en ? "Back to home" : "Zur Startseite"}</SiteButton>
          <SiteButton href={localizedHref("/kontakt", locale)} variant="amber">{en ? "Contact us" : "Kontakt aufnehmen"}</SiteButton>
        </div>
      </main>
    </LazyMotion>
  );
}
