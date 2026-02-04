import { ethers } from "hardhat";

async function main() {
  const TarsReports = await ethers.getContractFactory("TarsReports");
  const tars = await TarsReports.deploy();
  // Ethers v6 uses waitForDeployment()
  if (typeof (tars as any).waitForDeployment === "function") {
    await (tars as any).waitForDeployment();
  }
  console.log("TarsReports deployed to:", tars.target || (tars as any).address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
