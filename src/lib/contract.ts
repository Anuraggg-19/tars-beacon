// Ethers-based contract helpers for TARS.
import { ethers } from "ethers";

export interface OnChainReportRef {
  reporter: string;
  cid: string;
  timestamp: number;
  status: "pending" | "verified" | "flagged";
}

const CONTRACT_ADDRESS = import.meta.env.VITE_TARS_CONTRACT_ADDRESS as string | undefined;

// Minimal ABI matching contracts/TarsReports.sol
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "cid", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "submitReport",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReportCount",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ],
    "name": "getReport",
    "outputs": [
      { "internalType": "address", "name": "reporter", "type": "address" },
      { "internalType": "string", "name": "cid", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "string", "name": "cid", "type": "string" } ],
    "name": "getReportByCid",
    "outputs": [
      { "internalType": "address", "name": "reporter", "type": "address" },
      { "internalType": "string", "name": "_cid", "type": "string" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "cid", "type": "string" },
      { "internalType": "uint8", "name": "newStatus", "type": "uint8" }
    ],
    "name": "updateStatus",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

if (!CONTRACT_ADDRESS) {
  console.warn("VITE_TARS_CONTRACT_ADDRESS is not set — contract calls will fail until you deploy and configure the address.");
}

function getProviderFromWindow() {
  const anyWindow = window as any;
  if (!anyWindow.ethereum) throw new Error("Ethereum provider not found. Please install MetaMask.");
  return new ethers.BrowserProvider(anyWindow.ethereum);
}

export async function submitReportCidToContract(
  cid: string
): Promise<{ txHash: string; timestamp: Date }> {
  if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not configured");

  const provider = getProviderFromWindow();
  // Request accounts via provider
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const timestampSeconds = Math.floor(Date.now() / 1000);
  const tx = await contract.submitReport(cid, timestampSeconds);
  const receipt = await tx.wait();

  return {
    txHash: receipt.transactionHash,
    timestamp: new Date(timestampSeconds * 1000),
  };
}

export async function getReportsFromContract(): Promise<OnChainReportRef[]> {
  if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not configured");

  const provider = getProviderFromWindow();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  const countBig = await contract.getReportCount();
  const count = Number(countBig.toString());

  const results: OnChainReportRef[] = [];
  for (let i = 0; i < count; i++) {
    const r = await contract.getReport(i);
    const reporter = String(r[0]);
    const cid = String(r[1]);
    const timestamp = Number(r[2].toString());
    const statusNum = Number(r[3]);
    const status = statusNum === 1 ? "verified" : statusNum === 2 ? "flagged" : "pending";

    results.push({ reporter, cid, timestamp, status });
  }

  return results;
}

export async function updateReportStatus(
  cid: string,
  status: "pending" | "verified" | "flagged"
): Promise<void> {
  if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not configured");

  const provider = getProviderFromWindow();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const statusNum = status === "verified" ? 1 : status === "flagged" ? 2 : 0;
  const tx = await contract.updateStatus(cid, statusNum);
  await tx.wait();
}


