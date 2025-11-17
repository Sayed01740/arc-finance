import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy TokenA
  const TokenA = await ethers.getContractFactory("TestToken");
  const tokenA = await TokenA.deploy(
    "Token A",
    "TKA",
    ethers.parseEther("1000000"), // 1M tokens
    18
  );
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("TokenA deployed to:", tokenAAddress);

  // Deploy TokenB
  const TokenB = await ethers.getContractFactory("TestToken");
  const tokenB = await TokenB.deploy(
    "Token B",
    "TKB",
    ethers.parseEther("1000000"), // 1M tokens
    18
  );
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("TokenB deployed to:", tokenBAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("TokenA:", tokenAAddress);
  console.log("TokenB:", tokenBAddress);
  console.log("\nSave these addresses for AMM deployment!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
