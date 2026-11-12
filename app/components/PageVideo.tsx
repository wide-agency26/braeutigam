"use client";
import { getImageProps } from "next/image";
import { useRef, useState } from "react";
import type { PublicVideo } from "@/lib/content/public-types";
import type { Locale } from "@/lib/i18n";
import "./PageVideo.css";

export default function PageVideo({ video, locale = "de", compact = false }: { video: PublicVideo; locale?: Locale; compact?: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const poster = getImageProps({ src: video.posterUrl, alt: "", width: 1280, height: 720 }).props.src;
  return <figure className={`page-video${compact ? " page-video--compact" : " site-container"}`}>
    {/* Editors upload captions burned into spoken video; the transcript provides a text alternative. */}
    <video ref={player} controls playsInline preload="none" poster={poster} aria-label={video.title} onError={() => setFailed(true)}>
      <source src={video.videoUrl} />
      <a href={video.videoUrl}>{locale === "en" ? "Open video" : "Video öffnen"}</a>
    </video>
    {failed ? <p role="status">
      {locale === "en" ? "The video could not load. " : "Das Video konnte nicht geladen werden. "}
      <button type="button" className="underline" onClick={() => { setFailed(false); player.current?.load(); }}>{locale === "en" ? "Try again" : "Erneut versuchen"}</button>
    </p> : null}
    <figcaption><h3>{video.title}</h3>{video.description ? <p>{video.description}</p> : null}</figcaption>
    {video.transcript ? <details><summary>{locale === "en" ? "Read transcript" : "Transkript lesen"}</summary><p className="page-video__transcript">{video.transcript}</p></details> : null}
  </figure>;
}
