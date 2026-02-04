// Lightweight client-side crypto helpers for TARS.
// NOTE: This is a pragmatic implementation for your prototype, not a full
// production-grade cryptography library.

export interface EncryptedReportEnvelope {
  version: number;
  encryptedReport: {
    cipherText: string; // base64
    iv: string; // base64
    algo: "AES-256-GCM";
  };
  // In a real deployment this should be encrypted with an authority public key.
  // For now we store the raw key in base64 so the same browser can decrypt it.
  encryptedKeyForAuthority: string;
  meta: {
    createdAt: string;
    walletAddress: string;
    schema: "tars-report-v1";
  };
}

function getSubtle() {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  return window.crypto.subtle;
}

function toBase64(buffer: ArrayBuffer): string {
  return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(b64: string): ArrayBuffer {
  const binary = window.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptReportForAuthority(
  report: unknown,
  walletAddress: string
): Promise<EncryptedReportEnvelope> {
  const subtle = getSubtle();

  // 1) Generate a random AES-256-GCM key
  const key = await subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 2) Generate a random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encoder = new TextEncoder();
  const plaintext = encoder.encode(JSON.stringify(report));

  // 3) Encrypt plaintext
  const cipherBuffer = await subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  );

  // 4) Export symmetric key (for prototype only)
  const rawKey = await subtle.exportKey("raw", key);

  return {
    version: 1,
    encryptedReport: {
      cipherText: toBase64(cipherBuffer),
      iv: toBase64(iv.buffer),
      algo: "AES-256-GCM",
    },
    encryptedKeyForAuthority: toBase64(rawKey),
    meta: {
      createdAt: new Date().toISOString(),
      walletAddress,
      schema: "tars-report-v1",
    },
  };
}

export async function decryptReportEnvelope(
  envelope: EncryptedReportEnvelope
): Promise<any> {
  const subtle = getSubtle();

  const rawKey = fromBase64(envelope.encryptedKeyForAuthority);
  const key = await subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const iv = new Uint8Array(fromBase64(envelope.encryptedReport.iv));
  const cipher = fromBase64(envelope.encryptedReport.cipherText);

  const plainBuffer = await subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );

  const decoder = new TextDecoder();
  const json = decoder.decode(plainBuffer);
  return JSON.parse(json);
}

