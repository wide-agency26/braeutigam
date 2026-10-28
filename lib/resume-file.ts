export { MAX_RESUME_BYTES, RESUME_ERRORS } from "@/lib/resume-limits";

const PDF = Buffer.from("%PDF");
const OLE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const DOCX_ENTRY = "word/document.xml";

export type ResumeKind = {
  ext: "pdf" | "doc" | "docx";
  mime: string;
};

export function identifyResume(bytes: Buffer): ResumeKind | null {
  if (bytes.length >= PDF.length && bytes.subarray(0, PDF.length).equals(PDF)) {
    return { ext: "pdf", mime: "application/pdf" };
  }
  if (bytes.length >= OLE.length && bytes.subarray(0, OLE.length).equals(OLE)) {
    return { ext: "doc", mime: "application/msword" };
  }
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04 &&
    zipContainsEntry(bytes, DOCX_ENTRY)
  ) {
    return {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }
  return null;
}

export function sanitizeResumeName(name: string, ext: string) {
  const base = name.replace(/[/\\]/g, "").replace(/[^\w.\- ()äöüÄÖÜß]+/g, "_");
  const trimmed = base.trim().slice(0, 120);
  return trimmed || `resume.${ext}`;
}

function readU16(bytes: Buffer, offset: number) {
  if (offset < 0 || offset + 2 > bytes.length) return null;
  return bytes.readUInt16LE(offset);
}

function readU32(bytes: Buffer, offset: number) {
  if (offset < 0 || offset + 4 > bytes.length) return null;
  return bytes.readUInt32LE(offset);
}

function nameAt(bytes: Buffer, offset: number, length: number) {
  if (length < 0 || offset < 0 || offset + length > bytes.length) return null;
  return bytes.subarray(offset, offset + length).toString("utf8").replaceAll("\\", "/");
}

function zipContainsEntry(bytes: Buffer, target: string) {
  let offset = 0;
  let steps = 0;
  while (offset + 4 <= bytes.length && steps <= bytes.length) {
    steps += 1;
    const signature = readU32(bytes, offset);
    if (signature === 0x04034b50) {
      const flags = readU16(bytes, offset + 6);
      const compressedSize = readU32(bytes, offset + 18);
      const nameLength = readU16(bytes, offset + 26);
      const extraLength = readU16(bytes, offset + 28);
      if (
        flags === null ||
        compressedSize === null ||
        nameLength === null ||
        extraLength === null
      ) {
        return false;
      }
      if (nameAt(bytes, offset + 30, nameLength) === target) return true;
      if ((flags & 0x08) !== 0) {
        offset += 1;
        continue;
      }
      const next = offset + 30 + nameLength + extraLength + compressedSize;
      if (next <= offset) return false;
      offset = next;
      continue;
    }
    if (signature === 0x02014b50) {
      const nameLength = readU16(bytes, offset + 28);
      const extraLength = readU16(bytes, offset + 30);
      const commentLength = readU16(bytes, offset + 32);
      if (nameLength === null || extraLength === null || commentLength === null) return false;
      if (nameAt(bytes, offset + 46, nameLength) === target) return true;
      const next = offset + 46 + nameLength + extraLength + commentLength;
      if (next <= offset) return false;
      offset = next;
      continue;
    }
    offset += 1;
  }
  return false;
}
