"use client";

import { useActionState, useState } from "react";
import { saveVideo } from "@/app/actions/videos";
import { VIDEO_SLOTS, type VideoRecord } from "@/lib/videos";

export default function VideoForm({ slot, video }: { slot: (typeof VIDEO_SLOTS)[number]; video?: VideoRecord }) {
  const [state, action, pending] = useActionState(saveVideo, {});
  const [mode, setMode] = useState(video?.mode ?? "SHARED");
  const url = (id?: string) => id ? `https://www.youtube.com/watch?v=${id}` : "";
  const error = (field: string) => state.fieldErrors?.[field]?.[0];
  return (
    <section className="desk-panel desk-video" aria-labelledby={slot.id}>
      <h2 id={slot.id}>{slot.label}</h2>
      <form action={action} className="desk-form">
        <input type="hidden" name="slot" value={slot.id} />
        <label className="desk-field"><span>Video languages</span>
          <select className="desk-input" name="mode" value={mode} onChange={event => setMode(event.target.value)}>
            <option value="SHARED">One video for German and English</option>
            <option value="LOCALIZED">Different German and English videos</option>
          </select>
        </label>
        <div className="desk-grid-2">
          <label className="desk-field"><span>{mode === "SHARED" ? "YouTube link (both languages)" : "YouTube link (German)"}</span>
            <input className="desk-input" type="url" name="urlDe" defaultValue={url(video?.youtubeIdDe)} placeholder="https://www.youtube.com/watch?v=…" maxLength={500} aria-invalid={Boolean(error("urlDe"))} aria-describedby={error("urlDe") ? `${slot.id}-de-error` : undefined} />
            {error("urlDe") && <p className="desk-error" id={`${slot.id}-de-error`}>{error("urlDe")}</p>}
          </label>
          <label className="desk-field" hidden={mode === "SHARED"}><span>YouTube link (English)</span>
            <input className="desk-input" type={mode === "SHARED" ? "text" : "url"} name="urlEn" defaultValue={url(video?.youtubeIdEn)} maxLength={500} aria-invalid={Boolean(error("urlEn"))} aria-describedby={error("urlEn") ? `${slot.id}-en-error` : undefined} />
            {error("urlEn") && <p className="desk-error" id={`${slot.id}-en-error`}>{error("urlEn")}</p>}
          </label>
        </div>
        <div className="desk-grid-2">
          <label className="desk-field"><span>Title (DE, optional)</span><input className="desk-input" name="titleDe" defaultValue={video?.titleDe} placeholder={slot.de} maxLength={160} /></label>
          <label className="desk-field"><span>Title (EN, optional)</span><input className="desk-input" name="titleEn" defaultValue={video?.titleEn} placeholder={slot.en} maxLength={160} /></label>
        </div>
        <label><input type="checkbox" name="published" defaultChecked={video?.published ?? false} /> Publish this video</label>
        <p className="desk-hint">Uses the existing cover image. Videos load after the visitor confirms. Uncheck Publish to restore the photograph. Links must allow embedding.</p>
        <div aria-live="polite">{state.error && <p className="desk-error">{state.error}</p>}{state.success && <p>{state.success}</p>}</div>
        <button className="desk-btn desk-btn-primary" disabled={pending}>{pending ? "Saving…" : "Save video"}</button>
      </form>
    </section>
  );
}
