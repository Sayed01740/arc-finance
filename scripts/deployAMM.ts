import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying AMM with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get token addresses from environment or use default test addresses
  // For localhost testing, use the deployed addresses
  const tokenAAddress = process.env.TOKEN_A_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const tokenBAddress = process.env.TOKEN_B_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  if (!tokenAAddress || !tokenBAddress) {
    throw new Error("Please set TOKEN_A_ADDRESS and TOKEN_B_ADDRESS in .env file");
  }

  console.log("TokenA address:", tokenAAddress);
  console.log("TokenB address:", tokenBAddress);

  // Deploy AMM
  const AMM = await ethers.getContractFactory("SimpleAMM");
  const amm = await AMM.deploy(tokenAAddress, tokenBAddress);
  await amm.waitForDeployment();
  const ammAddress = await amm.getAddress();

  console.log("\n=== AMM Deployment Summary ===");
  console.log("AMM deployed to:", ammAddress);
  console.log("TokenA:", tokenAAddress);
  console.log("TokenB:", tokenBAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
