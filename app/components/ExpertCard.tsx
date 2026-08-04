"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import "./ExpertCard.css";

export interface ExpertCardProps {
  name: string;
  title?: string;
  email: string;
  phone: string;
  avatarUrl: string;
  memberId?: string;
  gridTag?: string;
  statusBadge?: string;
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
  title,
  email,
  phone,
  avatarUrl,
  memberId = "#000-000",
  gridTag = "GRID_Z_72.4",
  statusBadge = "NOMINAL",
}: ExpertCardProps) {
  const initials = useMemo(() => initialsOf(name), [name]);
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const tiles = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);

  return (
    /* Stable hit box — card can lift without losing :hover (no blink loop) */
    <div className="expert-card-hit">
      <article className="expert-card">
        {/* Glow on SVG only — never transitioned */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="expert-card__bg"
          src="/images/ui/expert-card-bg.svg"
          alt=""
          aria-hidden
          draggable={false}
        />

        <div className="expert-card__overlay" aria-hidden>
          {tiles.map((i) => (
            <span key={i} className="expert-card__initial">
              {initials}
            </span>
          ))}
        </div>

        <div className="expert-card__inner">
          <header className="expert-card__meta">
            <span className="expert-card__sys">
              SYS_OPERATIONAL // CORE_MEMBER
            </span>
            <span className="expert-card__badge">{statusBadge}</span>
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
            <span className="expert-card__grid">{gridTag}</span>
          </div>

          <div className="expert-card__info">
            <h3 className="expert-card__name">{name}</h3>
            <div className="expert-card__row">
              <p className="expert-card__verified">
                {title?.trim() || "DIGITAL VERIFIED"}
              </p>
              <p className="expert-card__id">ID: {memberId}</p>
            </div>
            <div className="expert-card__line" aria-hidden />
          </div>

          <div className="expert-card__actions">
            <div className="expert-card__action-group">
              <a href={`mailto:${email}`} className="expert-card__btn">
                EMAIL
              </a>
              <a href={telHref} className="expert-card__btn">
                PHONE
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

const ExpertCard = React.memo(ExpertCardComponent);
export default ExpertCard;
