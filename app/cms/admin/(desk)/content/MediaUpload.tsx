"use client";
import { useId, useState } from "react";
import { beginMediaUpload, finishMediaUpload } from "@/app/actions/media";
import { IMAGE_LIMIT, MEDIA_LIMIT } from "@/lib/content/config";

async function webp(file: File) {
  if (file.size > 20 * 1024 * 1024) throw new Error("Choose an image smaller than 20 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Image conversion failed.")), "image/webp", 0.86));
    if (blob.type !== "image/webp" || blob.size > IMAGE_LIMIT) throw new Error("The converted image is too large. Choose a smaller image.");
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } finally { bitmap.close(); }
}

export function MediaUpload({ name, label, value = "", kind, onBusy }: {
  name: string; label: string; value?: string; kind: "image" | "video"; onBusy: (busy: boolean) => void;
}) {
  const id = useId();
  const [url, setUrl] = useState(value);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(original?: File) {
    if (!original) return;
    setBusy(true); onBusy(true); setStatus("Preparing upload…");
    try {
      const file = kind === "image" ? await webp(original) : original;
      if (kind === "video" && (!["video/mp4", "video/webm"].includes(file.type) || file.size > MEDIA_LIMIT)) throw new Error("Choose an MP4 or WebM video up to 50 MB.");
      const ticket = await beginMediaUpload({ filename: file.name, mime: file.type, bytes: file.size });
      if (ticket.error || !ticket.signedUrl || !ticket.id) throw new Error(ticket.error || "Could not begin upload.");
      setStatus("Uploading… keep this page open.");
      // The signed URL is scoped to one new object. No Supabase secret reaches the browser.
      const response = await fetch(ticket.signedUrl, { method: "PUT", headers: { "Content-Type": file.type, "x-upsert": "false", "cache-control": "max-age=31536000" }, body: file });
      if (!response.ok) throw new Error("Upload failed. Please try again.");
      setStatus("Verifying upload…");
      const result = await finishMediaUpload(ticket.id);
      if (result.error || !result.url) throw new Error(result.error || "Verification failed.");
      setUrl(result.url); setStatus("Uploaded. Save this entry to use the new file.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); onBusy(false); }
  }
  return <div className="desk-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="file" disabled={busy} accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"} onChange={event => void upload(event.target.files?.[0])} />
    <input type="hidden" name={name} value={url} />
    <p className="desk-hint">{kind === "image" ? "JPEG, PNG or WebP. Photos are resized and converted to WebP." : "MP4 or WebM, up to 50 MB. Playback begins only when a visitor presses play."} Public website media only; never CVs or private documents.</p>
    {url ? <a className="desk-link" href={url} target="_blank" rel="noopener noreferrer">Preview current {kind}</a> : null}
    <p className="desk-hint" role="status" aria-live="polite">{status}</p>
  </div>;
}
