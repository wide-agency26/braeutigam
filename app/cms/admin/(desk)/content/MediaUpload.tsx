"use client";
import { useEffect, useId, useRef, useState } from "react";
import { beginMediaUpload, finishMediaUpload } from "@/app/actions/media";
import { IMAGE_LIMIT, MEDIA_LIMIT } from "@/lib/content/config";
import { uploadMediaFile } from "@/lib/content/upload-client";

async function webp(file: File) {
  if (file.size > 20 * 1024 * 1024) throw new Error("Choose an image smaller than 20 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image conversion is unavailable in this browser. Try another browser.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Image conversion failed.")), "image/webp", 0.86));
    if (blob.type !== "image/webp" || blob.size > IMAGE_LIMIT) throw new Error("The converted image is too large. Choose a smaller image.");
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } finally { bitmap.close(); }
}

export function MediaUpload({ name, label, value = "", kind, onBusy, error }: {
  name: string; label: string; value?: string; kind: "image" | "video"; onBusy: (busy: boolean) => void; error?: string;
}) {
  const id = useId();
  const [url, setUrl] = useState(value);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);
  async function upload(original?: File) {
    if (!original) return;
    const uploadController = new AbortController();
    controller.current = uploadController;
    const checkCancelled = () => { if (uploadController.signal.aborted) throw new Error("Upload cancelled."); };
    setBusy(true); onBusy(true); setProgress(null); setStatus("Preparing upload…");
    try {
      const file = kind === "image" ? await webp(original) : original;
      checkCancelled();
      if (kind === "video" && (!["video/mp4", "video/webm"].includes(file.type) || file.size > MEDIA_LIMIT)) throw new Error("Choose an MP4 or WebM video up to 50 MB.");
      const ticket = await beginMediaUpload({ filename: file.name, mime: file.type, bytes: file.size });
      checkCancelled();
      if (ticket.error || !ticket.signedUrl || !ticket.id) throw new Error(ticket.error || "Could not begin upload.");
      setStatus("Uploading… keep this page open.");
      setProgress(0);
      // The signed URL is scoped to one new object. No Supabase secret reaches the browser.
      await uploadMediaFile(ticket.signedUrl, file, uploadController.signal, setProgress);
      checkCancelled();
      setProgress(null);
      setStatus("Verifying upload…");
      const result = await finishMediaUpload(ticket.id);
      checkCancelled();
      if (result.error || !result.url) throw new Error(result.error || "Verification failed.");
      setUrl(result.url); setStatus("Uploaded. Save this entry to use the new file.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload failed."); }
    finally { controller.current = null; setBusy(false); setProgress(null); onBusy(false); }
  }
  return <div className="desk-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="file" disabled={busy} accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm"} onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }} />
    <input type="hidden" name={name} value={url} />
    <p className="desk-hint">{kind === "image" ? "JPEG, PNG or WebP. Photos are resized and converted to WebP." : "MP4 or WebM, up to 50 MB. Playback begins only when a visitor presses play."} Public website media only; never CVs or private documents.</p>
    {url ? <a className="desk-link" href={url} target="_blank" rel="noopener noreferrer">Preview current {kind}</a> : null}
    <p className="desk-hint" role="status" aria-live="polite">{status}</p>
    {error && !url ? <p className="desk-error" role="alert">{error}</p> : null}
    {progress !== null ? <div><progress max={100} value={progress} aria-label={`${label} upload progress`} /> <span>{progress}%</span></div> : null}
    {busy ? <button className="desk-btn" type="button" onClick={() => controller.current?.abort()}>Cancel upload</button> : null}
  </div>;
}
