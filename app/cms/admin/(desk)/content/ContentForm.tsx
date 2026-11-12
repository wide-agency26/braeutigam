"use client";
import { useActionState, useState } from "react";
import { saveContent, deleteContent, type ContentState } from "@/app/actions/content";
import { VIDEO_PLACEMENTS } from "@/lib/content/config";
import type { ContentKind } from "@/lib/content/validation";
import { MediaUpload } from "./MediaUpload";

export type ContentValues = Record<string, string | number | boolean>;
const INITIAL: ContentState = {};
export function ContentForm({ kind, values = {} }: { kind: ContentKind; values?: ContentValues }) {
  const [state, action, pending] = useActionState(saveContent, INITIAL);
  values = { ...values, ...state.values };
  const [uploads, setUploads] = useState(0);
  const busy = (active: boolean) => setUploads(count => count + (active ? 1 : -1));
  const text = (name: string, label: string, options: { required?: boolean; multiline?: boolean; type?: string; hint?: string } = {}) => <label className="desk-field" key={name}>
    <span>{label}</span>
    {options.multiline ? <textarea className="desk-textarea" name={name} defaultValue={String(values[name] ?? "")} rows={5} /> :
      <input className="desk-input" name={name} type={options.type ?? "text"} defaultValue={String(values[name] ?? (name === "sortOrder" ? 0 : ""))} required={options.required} min={name === "sortOrder" ? 0 : undefined} max={name === "sortOrder" ? 9999 : undefined} />}
    {options.hint ? <small className="desk-hint">{options.hint}</small> : null}
    {state.fieldErrors?.[name] ? <span className="desk-error">{state.fieldErrors[name]?.[0]}</span> : null}
  </label>;
  const media = (name: string, label: string, mediaKind: "image" | "video") => <div key={name}>
    <MediaUpload name={name} label={label} kind={mediaKind} value={String(values[name] ?? "")} onBusy={busy} error={state.fieldErrors?.[name]?.[0]} />
  </div>;
  return <>
    <form action={action} className="desk-form">
      <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={String(values.id ?? "")} />
      {state.error ? <p className="desk-banner" role="alert">{state.error}</p> : null}
      {kind === "team" ? <>
        {text("name", "Name", { required: true })}
        {text("title", "Role (German)", { required: true })}{text("titleEn", "Role (English)")}
        {text("memberId", "Card identifier", { required: true, hint: "For example #706-MW. Shown on the team card." })}
        <div className="desk-grid-2">{text("email", "Work email", { type: "email" })}{text("phone", "Work phone")}</div>
        <label className="desk-check"><input type="checkbox" name="showContact" defaultChecked={values.showContact !== false} /> Show work contact details on the website</label>
        {media("avatarUrl", "Portrait", "image")}
      </> : <>
        {text("title", "Title (German)", { required: true })}{text("titleEn", "Title (English)")}
        {kind === "videos" ? <>
          <label className="desk-field"><span>Page placement</span><select name="placement" className="desk-input" defaultValue={String(values.placement ?? "home-feature")}>
            {Object.entries(VIDEO_PLACEMENTS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
          {media("videoUrl", "Video", "video")}{media("posterUrl", "Poster image", "image")}
          {text("description", "Description (German)", { multiline: true })}{text("descriptionEn", "Description (English)", { multiline: true })}
          {text("transcript", "Transcript (German)", { multiline: true, hint: "Add spoken content as accessible text. Caption spoken video before uploading." })}
          {text("transcriptEn", "Transcript (English)", { multiline: true })}
        </> : <>
          {text("permalink", "Instagram reel link", { type: "url", required: true, hint: "Paste the reel's Instagram share link. Visitors open the reel on Instagram; nothing embeds or tracks them here." })}
          {media("imageUrl", "Reel cover", "image")}
        </>}
      </>}
      {kind !== "videos" ? text("sortOrder", "Display order", { type: "number", hint: "Lower numbers appear first." }) : null}
      <label className="desk-check"><input type="checkbox" name="published" defaultChecked={values.published === true} /> Published on the website</label>
      <p className="desk-hint">Leave Published unchecked to save a draft. Blank English fields use the German text.</p>
      <button className="desk-btn desk-btn-primary" disabled={pending || uploads > 0} type="submit">{pending ? "Saving…" : uploads > 0 ? "Upload in progress…" : "Save entry"}</button>
    </form>
    {values.id ? <form action={deleteContent} className="desk-delete-form" onSubmit={event => { if (!window.confirm("Remove this entry from the CMS and website? You can uncheck Published instead to keep a draft.")) event.preventDefault(); }}>
      <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={String(values.id)} />
      <button type="submit" className="desk-btn desk-btn-danger">Remove entry</button>
    </form> : null}
  </>;
}
