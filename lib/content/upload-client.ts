/** Browser-only direct upload. Progress, cancellation and a finite network wait. */
export function uploadMediaFile(url: string, file: File, signal: AbortSignal, onProgress: (percent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new Error("Upload cancelled.")); return; }
    const xhr = new XMLHttpRequest();
    const abort = () => xhr.abort();
    const finish = (error?: Error) => {
      signal.removeEventListener("abort", abort);
      if (error) reject(error); else resolve();
    };
    xhr.open("PUT", url);
    xhr.timeout = 5 * 60 * 1000;
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=31536000");
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100));
    };
    xhr.onload = () => finish(xhr.status >= 200 && xhr.status < 300 ? undefined : new Error("Upload failed. Please try again."));
    xhr.onerror = () => finish(new Error("Connection lost. Please check your connection and try again."));
    xhr.ontimeout = () => finish(new Error("Upload timed out. Try a smaller file or a faster connection."));
    xhr.onabort = () => finish(new Error("Upload cancelled."));
    signal.addEventListener("abort", abort, { once: true });
    xhr.send(file);
  });
}
