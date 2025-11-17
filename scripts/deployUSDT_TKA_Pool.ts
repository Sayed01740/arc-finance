import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying USDT ↔ TKA AMM Pool with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // USDT (Official Arc Testnet Token)
  const usdtAddress = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a";
  // TKA (Token A)
  const tkaAddress = process.env.TOKEN_A_ADDRESS || "0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496";

  if (!tkaAddress) {
    throw new Error("Please set TOKEN_A_ADDRESS in .env file");
  }

  console.log("\n=== Pool Configuration ===");
  console.log("TokenA (USDT):", usdtAddress);
  console.log("TokenB (TKA):", tkaAddress);

  // Deploy AMM
  const AMM = await ethers.getContractFactory("SimpleAMM");
  const amm = await AMM.deploy(usdtAddress, tkaAddress);
  await amm.waitForDeployment();
  const ammAddress = await amm.getAddress();

  console.log("\n=== USDT/TKA Pool Deployment Summary ===");
  console.log("AMM Pool Address:", ammAddress);
  console.log("USDT Address:", usdtAddress);
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

