// Minimal IPFS HTTP client helpers.
// These are intentionally generic so you can point them at any IPFS HTTP API
// (e.g. a local node, Infura, Pinata, Web3.Storage, etc.).
//
// IMPORTANT:
// - In the browser you CANNOT use `https://ipfs.io/api/v0` directly because it
//   does not send CORS headers, which causes "TypeError: Failed to fetch".
// - To use real IPFS uploads, configure VITE_IPFS_API_URL to point at an
//   IPFS HTTP API that has CORS enabled for your origin.
// - When VITE_IPFS_API_URL is NOT set, these helpers fall back to generating
//   mock CIDs locally so the app flow keeps working without network calls.

const IPFS_API_URL = import.meta.env.VITE_IPFS_API_URL as string | undefined;
const LOCAL_STORAGE_PREFIX = "tars_ipfs_mock_";

function generateMockCid(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return (
    "Qm" +
    Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
}

export async function uploadJsonToIpfs(payload: unknown): Promise<string> {
  // No API URL configured – return a mock CID so the app keeps working.
  if (!IPFS_API_URL) {
    console.warn(
      "VITE_IPFS_API_URL is not set. Storing encrypted payload locally and returning a mock CID instead of calling a real IPFS node."
    );
    const cid = generateMockCid();
    try {
      window.localStorage.setItem(
        `${LOCAL_STORAGE_PREFIX}${cid}`,
        JSON.stringify(payload)
      );
    } catch {
      // ignore storage errors in mock mode
    }
    return cid;
  }

  const body = new FormData();
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  body.append("file", blob, "report.json");

  const res = await fetch(`${IPFS_API_URL}/add`, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to upload to IPFS");
  }

  const data = await res.json();
  // Most IPFS HTTP APIs return { Hash: "<cid>" }
  return data.Hash || data.cid || data.Cid || "";
}

export async function uploadFileToIpfs(file: File): Promise<string> {
  // No API URL configured – return a mock CID so the app keeps working.
  if (!IPFS_API_URL) {
    console.warn(
      "VITE_IPFS_API_URL is not set. uploadFileToIpfs is returning a mock CID instead of calling a real IPFS node."
    );
    return generateMockCid();
  }

  const body = new FormData();
  body.append("file", file, file.name);

  const res = await fetch(`${IPFS_API_URL}/add`, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    throw new Error("Failed to upload file to IPFS");
  }

  const data = await res.json();
  return data.Hash || data.cid || data.Cid || "";
}

const IPFS_GATEWAY_URL =
  import.meta.env.VITE_IPFS_GATEWAY_URL || "https://ipfs.io/ipfs";

export async function fetchJsonFromIpfs<T = unknown>(cid: string): Promise<T> {
  // If we're in mock mode (no API URL) and have a locally stored payload for
  // this CID, return it instead of doing a network fetch. This keeps the
  // end-to-end flow working without a real IPFS node.
  if (!IPFS_API_URL) {
    const key = `${LOCAL_STORAGE_PREFIX}${cid}`;
    const raw = window.localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  }

  const res = await fetch(`${IPFS_GATEWAY_URL}/${cid}`);
  if (!res.ok) {
    throw new Error("Failed to fetch from IPFS");
  }
  return (await res.json()) as T;
}

