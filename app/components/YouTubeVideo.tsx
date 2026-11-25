"use client";

import { useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import type { PublishedVideo } from "@/lib/videos";
import type { Locale } from "@/lib/i18n";
import "./YouTubeVideo.css";

export default function YouTubeVideo({ video, locale, poster }: { video: PublishedVideo; locale: Locale; poster: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  return <div className="youtube-video">
    {allowed ? <>
      <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&hl=${locale}`} title={video.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      <a className="youtube-video__fallback" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">{locale === "en" ? "Open on YouTube" : "Auf YouTube öffnen"}</a>
    </> : <>
      {poster}
      <button className="youtube-video__consent" onClick={() => setAllowed(true)} type="button">
        <Play size={32} aria-hidden="true" />
        <span>{locale === "en" ? "Load video" : "Video laden"}: {video.title}</span>
        <small>{locale === "en" ? "Loads external content from YouTube." : "Lädt externe Inhalte von YouTube."}</small>
      </button>
    </>}
  </div>;
}
