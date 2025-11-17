import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying FarmingRewards contract with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get addresses from environment
  const ammAddress = process.env.AMM_ADDRESS || process.env.NEXT_PUBLIC_AMM_ADDRESS;
  const rewardTokenAddress = process.env.REWARD_TOKEN_ADDRESS || process.env.TOKEN_A_ADDRESS;

  if (!ammAddress) {
    throw new Error("Please set AMM_ADDRESS in .env file (this will be the staking token - LP token from AMM)");
  }

  if (!rewardTokenAddress) {
    throw new Error("Please set REWARD_TOKEN_ADDRESS or TOKEN_A_ADDRESS in .env file");
  }

  // Reward rate: 0.01 tokens per second (configurable)
  const rewardRate = ethers.parseEther("0.01"); // 0.01 tokens per second
  const rewardsDuration = 7 * 24 * 60 * 60; // 7 days in seconds

  console.log("\n=== Deployment Configuration ===");
  console.log("Staking Token (AMM LP):", ammAddress);
  console.log("Reward Token:", rewardTokenAddress);
  console.log("Reward Rate:", ethers.formatEther(rewardRate), "tokens/second");
  console.log("Rewards Duration:", rewardsDuration / (24 * 60 * 60), "days");

  // Deploy FarmingRewards
  const FarmingRewards = await ethers.getContractFactory("FarmingRewards");
  const farming = await FarmingRewards.deploy(
    ammAddress,           // staking token (AMM contract address - users stake LP tokens)
    rewardTokenAddress,   // reward token
    rewardRate,           // reward rate per second
    rewardsDuration       // rewards duration in seconds
  );

  await farming.waitForDeployment();
  const farmingAddress = await farming.getAddress();

  console.log("\n=== FarmingRewards Deployment Summary ===");
  console.log("FarmingRewards deployed to:", farmingAddress);
  console.log("Staking Token (LP):", ammAddress);
  console.log("Reward Token:", rewardTokenAddress);
  console.log("\n✅ Farming contract deployed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Approve reward tokens to farming contract");
  console.log("2. Call notifyRewardAmount() to start rewards");
  console.log("3. Users can stake LP tokens to earn rewards");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

