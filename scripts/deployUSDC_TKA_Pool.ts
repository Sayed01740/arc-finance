import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying USDC ↔ TKA AMM Pool with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // USDC (Official Arc Testnet Token)
  const usdcAddress = "0x3600000000000000000000000000000000000000";
  // TKA (Token A)
  const tkaAddress = process.env.TOKEN_A_ADDRESS || "0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496";

  if (!tkaAddress) {
    throw new Error("Please set TOKEN_A_ADDRESS in .env file");
  }

  console.log("\n=== Pool Configuration ===");
  console.log("TokenA (USDC):", usdcAddress);
  console.log("TokenB (TKA):", tkaAddress);

  // Deploy AMM
  const AMM = await ethers.getContractFactory("SimpleAMM");
  const amm = await AMM.deploy(usdcAddress, tkaAddress);
  await amm.waitForDeployment();
  const ammAddress = await amm.getAddress();

  console.log("\n=== USDC/TKA Pool Deployment Summary ===");
  console.log("AMM Pool Address:", ammAddress);
  console.log("USDC Address:", usdcAddress);
  console.log("TKA Address:", tkaAddress);
  console.log("\n✅ Pool deployed successfully!");
  console.log("\n📝 Next step: Add liquidity to this pool");
  console.log("   Set AMM_ADDRESS=" + ammAddress + " in .env");
  console.log("   Then run: npm run add-liquidity");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

