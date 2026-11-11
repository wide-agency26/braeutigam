"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useCardTilt } from "../hooks/useCardTilt";
import SiteButton from "./SiteButton";
import "./ExpertCard.css";

export interface ExpertCardProps {
  name: string;
  title?: string;
  email: string;
  phone: string;
  avatarUrl: string;
  memberId?: string;
  headingLevel?: 2 | 3;
  showContact?: boolean;
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ExpertCardComponent({
  name,
  title = "PRODUCTION & PROJECT MANAGER",
  email,
  phone,
  avatarUrl,
  memberId = "#000-000",
  headingLevel = 3,
  showContact = true,
}: ExpertCardProps) {
  const initials = useMemo(() => initialsOf(name), [name]);
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const tiltRef = useCardTilt<HTMLDivElement>(9);
  const NameHeading = headingLevel === 2 ? "h2" : "h3";

  return (
    /* Stable hit box — card can lift without losing :hover (no blink loop).
       Also owns the pointer listeners and the perspective the card tilts in. */
    <div ref={tiltRef} className="expert-card-hit">
      <div className="expert-card__behind" aria-hidden />

      <article className="expert-card">
        {/* Glow on SVG only — never transitioned */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="expert-card__bg expert-card__bg--dark"
          src="/images/ui/expert-card-bg.svg"
          alt=""
          aria-hidden
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="expert-card__bg expert-card__bg--light"
          src="/images/ui/expert-card-bg-light.svg"
          alt=""
          aria-hidden
          draggable={false}
        />

        <div className="expert-card__overlay" aria-hidden>
          <span className="expert-card__initial">{initials}</span>
        </div>

        <div className="expert-card__inner">
          <header className="expert-card__meta">
            <span className="expert-card__sys copy-tiny">
              SYS_OPERATIONAL // CORE_MEMBER
            </span>
          </header>

          <div className="expert-card__portrait">
            <div className="expert-card__portrait-inner">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 362px"
              />
            </div>
            <span className="expert-card__verified-tag copy-tiny">DIGITAL VERIFIED</span>
          </div>

          <div className="expert-card__info">
            <NameHeading className="expert-card__name team-card-primary">{name}</NameHeading>
            <div className="expert-card__row copy-tiny">
              <p className="expert-card__role">{title}</p>
              <p className="expert-card__id">ID: {memberId}</p>
            </div>
          </div>

          {showContact ? (
            <div className="expert-card__actions">
              <div className="expert-card__action-group">
                <SiteButton href={`mailto:${email}`} size="sm">
                  EMAIL
                </SiteButton>
                <SiteButton href={telHref} size="sm" variant="solid">
                  PHONE
                </SiteButton>
              </div>
            </div>
          ) : null}
        </div>

        {/* Reflective glass layers sit above the content, like reactbits'
            ProfileCard: a holographic sheen then a specular highlight. */}
        <div className="expert-card__sheen" aria-hidden />
        <div className="expert-card__glare" aria-hidden />
      </article>
    </div>
  );
}

const ExpertCard = React.memo(ExpertCardComponent);
export default ExpertCard;
