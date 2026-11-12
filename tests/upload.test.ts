import assert from "node:assert/strict";
import { test } from "node:test";
import { uploadMediaFile } from "../lib/content/upload-client";

class RequestStub {
  static last: RequestStub;
  status = 200;
  timeout = 0;
  headers: Record<string, string> = {};
  upload = { onprogress: null as ((event: { lengthComputable: boolean; loaded: number; total: number }) => void) | null };
  onload?: () => void;
  onerror?: () => void;
  ontimeout?: () => void;
  onabort?: () => void;
  method = "";
  url = "";
  body?: File;
  constructor() { RequestStub.last = this; }
  open(method: string, url: string) { this.method = method; this.url = url; }
  setRequestHeader(key: string, value: string) { this.headers[key] = value; }
  send(body: File) { this.body = body; }
  abort() { this.onabort?.(); }
}

const file = new File(["test"], "test.webm", { type: "video/webm" });
test("direct upload reports progress and sends only file-scoped request headers", async context => {
  const original = globalThis.XMLHttpRequest;
  globalThis.XMLHttpRequest = RequestStub as unknown as typeof XMLHttpRequest;
  context.after(() => { globalThis.XMLHttpRequest = original; });
  const progress: number[] = [];
  const promise = uploadMediaFile("https://storage.example.test/scoped-ticket", file, new AbortController().signal, value => progress.push(value));
  const xhr = RequestStub.last;
  assert.equal(xhr.method, "PUT");
  assert.equal(xhr.body, file);
  assert.equal(xhr.headers["Content-Type"], "video/webm");
  assert.equal(xhr.headers["x-upsert"], "false");
  assert.equal(xhr.headers.Authorization, undefined);
  assert.ok(xhr.timeout > 0 && xhr.timeout <= 300000);
  xhr.upload.onprogress?.({ lengthComputable: true, loaded: 2, total: 4 });
  xhr.onload?.();
  await promise;
  assert.deepEqual(progress, [50]);
});

test("cancel, network failure, timeout, and rejected upload all release the pending request", async context => {
  const original = globalThis.XMLHttpRequest;
  globalThis.XMLHttpRequest = RequestStub as unknown as typeof XMLHttpRequest;
  context.after(() => { globalThis.XMLHttpRequest = original; });
  for (const failure of ["abort", "network", "timeout", "rejected"] as const) {
    const controller = new AbortController();
    const promise = uploadMediaFile("https://storage.example.test/scoped-ticket", file, controller.signal, () => {});
    const xhr = RequestStub.last;
    const rejected = assert.rejects(promise, /cancelled|Connection lost|timed out|Upload failed/);
    if (failure === "abort") controller.abort();
    else if (failure === "network") xhr.onerror?.();
    else if (failure === "timeout") xhr.ontimeout?.();
    else { xhr.status = 403; xhr.onload?.(); }
    await rejected;
  }
});

test("an already cancelled upload never creates a network request", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(uploadMediaFile("https://storage.example.test/scoped-ticket", file, controller.signal, () => {}), /cancelled/);
});
