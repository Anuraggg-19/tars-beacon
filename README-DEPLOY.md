# TARS Beacon — Local Hardhat Deployment & Frontend Instructions

This file explains how to compile & deploy the `TarsReports` contract locally with Hardhat and run the frontend connected to it.

Prerequisites
- Node.js (16+)
- npm or pnpm
- MetaMask browser extension

1) Install dependencies

PowerShell
```
npm install
```

2) Start a local Hardhat node (new terminal)

PowerShell
```
npx hardhat node
```

This will run a local JSON-RPC node at `http://127.0.0.1:8545` and print funded accounts.

3) Compile & deploy the contract to the local node (in project root)

PowerShell
```
npm run hardhat:compile
npm run hardhat:deploy
```

The deploy script will print the deployed contract address. Copy this address.

4) Configure the frontend with the deployed address

Create a `.env.local` (or set environment variables) with:

```
VITE_TARS_CONTRACT_ADDRESS=0xYourDeployedAddressHere
VITE_IPFS_API_URL=          # Optional: set to your IPFS API if you have one
VITE_IPFS_GATEWAY_URL=https://ipfs.io/ipfs
```

5) Run the frontend

PowerShell
```
npm run dev
```

6) Testing the flow
- In MetaMask, connect to the local node: RPC `http://127.0.0.1:8545`, chain id `31337`.
- Use one of the pre-funded accounts from `npx hardhat node`.
- Submit a report from the frontend — MetaMask will prompt for transaction approval.
- Open the Authority Dashboard and view reports; the UI will read on-chain data.

Notes & next steps
- The frontend currently includes a minimal ABI for `TarsReports` in `src/lib/contract.ts` — if you recompile, artifacts are in `artifacts/contracts/TarsReports.sol/TarsReports.json`.
- To use real IPFS uploads, set `VITE_IPFS_API_URL` to a CORS-enabled IPFS HTTP API (or use `web3.storage`).
- Consider adding an indexer/backend (The Graph or a small off-chain service) for production reporting and permissioning.
