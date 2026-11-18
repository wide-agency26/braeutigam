// Cloudflare sets this header at its edge. Do not trust caller-supplied XFF here.
export function clientAddress(headers: Headers) {
  return headers.get("cf-connecting-ip")?.trim() || "unknown";
}
