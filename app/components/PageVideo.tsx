"use client";
import type { PublicVideo } from "@/lib/content/public-types";
import type { Locale } from "@/lib/i18n";
import "./PageVideo.css";

export default function PageVideo({ video, locale = "de", compact = false }: { video: PublicVideo; locale?: Locale; compact?: boolean }) {
  return <figure className={`page-video${compact ? " page-video--compact" : " site-container"}`}>
    {/* Editors upload captions burned into spoken video; the transcript provides a text alternative. */}
    <video controls playsInline preload="none" poster={video.posterUrl} aria-label={video.title}>
      <source src={video.videoUrl} />
      <a href={video.videoUrl}>{locale === "en" ? "Open video" : "Video öffnen"}</a>
    </video>
    <figcaption><h3>{video.title}</h3>{video.description ? <p>{video.description}</p> : null}</figcaption>
    {video.transcript ? <details><summary>{locale === "en" ? "Read transcript" : "Transkript lesen"}</summary><p className="page-video__transcript">{video.transcript}</p></details> : null}
  </figure>;
}
