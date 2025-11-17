import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Adding liquidity with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // For localhost testing, use the deployed addresses
  const tokenAAddress = process.env.TOKEN_A_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const tokenBAddress = process.env.TOKEN_B_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const ammAddress = process.env.AMM_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  if (!tokenAAddress || !tokenBAddress || !ammAddress) {
    throw new Error("Please set TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, and AMM_ADDRESS in .env file");
  }

  const amountA = ethers.parseEther(process.env.LIQUIDITY_AMOUNT_A || "1000");
  const amountB = ethers.parseEther(process.env.LIQUIDITY_AMOUNT_B || "1000");

  // Get contracts
  const tokenA = await ethers.getContractAt("TestToken", tokenAAddress);
  const tokenB = await ethers.getContractAt("TestToken", tokenBAddress);
  const amm = await ethers.getContractAt("SimpleAMM", ammAddress);

  console.log(`Adding liquidity: ${ethers.formatEther(amountA)} TokenA, ${ethers.formatEther(amountB)} TokenB`);

  // Check balances
  const balanceA = await tokenA.balanceOf(deployer.address);
  const balanceB = await tokenB.balanceOf(deployer.address);
  console.log(`Token A balance: ${ethers.formatEther(balanceA)}`);
  console.log(`Token B balance: ${ethers.formatEther(balanceB)}`);

  // Approve tokens
  console.log("Approving tokens...");
  const approveA = await tokenA.approve(ammAddress, amountA);
  await approveA.wait();
  const approveB = await tokenB.approve(ammAddress, amountB);
  await approveB.wait();
  console.log("Approvals confirmed");

  // Add liquidity
  console.log("Adding liquidity to AMM...");
  const tx = await amm.addLiquidity(amountA, amountB, deployer.address);
  await tx.wait();

  console.log("Liquidity added successfully!");
  
  // Check reserves
  const [reserveA, reserveB] = await amm.getReserves();
  console.log("\n=== Pool Reserves ===");
  console.log("ReserveA:", ethers.formatEther(reserveA));
  console.log("ReserveB:", ethers.formatEther(reserveB));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
