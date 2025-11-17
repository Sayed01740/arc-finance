import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Adding liquidity with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Get addresses from environment
  const tokenAAddress = process.env.TOKEN_A_ADDRESS;
  const tokenBAddress = process.env.TOKEN_B_ADDRESS;
  const ammAddress = process.env.AMM_ADDRESS;

  if (!tokenAAddress || !tokenBAddress || !ammAddress) {
    throw new Error("Please set TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, and AMM_ADDRESS in .env file");
  }

  const amountA = ethers.parseEther(process.env.LIQUIDITY_AMOUNT_A || "1000");
  const amountB = ethers.parseEther(process.env.LIQUIDITY_AMOUNT_B || "1000");

  console.log("\n=== Pool Configuration ===");
  console.log("TokenA:", tokenAAddress);
  console.log("TokenB:", tokenBAddress);
  console.log("AMM Address:", ammAddress);
  console.log(`Amount A: ${ethers.formatEther(amountA)}`);
  console.log(`Amount B: ${ethers.formatEther(amountB)}`);

  // Get contracts - handle both TestToken and ERC20 interface
  let tokenA, tokenB;
  
  try {
    tokenA = await ethers.getContractAt("TestToken", tokenAAddress);
  } catch {
    // If not TestToken, use ERC20 interface
    const erc20Abi = [
      "function balanceOf(address) view returns (uint256)",
      "function approve(address, uint256) returns (bool)",
      "function transfer(address, uint256) returns (bool)",
      "function transferFrom(address, address, uint256) returns (bool)",
    ];
    tokenA = await ethers.getContractAt(erc20Abi, tokenAAddress);
  }

  try {
    tokenB = await ethers.getContractAt("TestToken", tokenBAddress);
  } catch {
    const erc20Abi = [
      "function balanceOf(address) view returns (uint256)",
      "function approve(address, uint256) returns (bool)",
      "function transfer(address, uint256) returns (bool)",
      "function transferFrom(address, address, uint256) returns (bool)",
    ];
    tokenB = await ethers.getContractAt(erc20Abi, tokenBAddress);
  }

  const amm = await ethers.getContractAt("SimpleAMM", ammAddress);

  // Check balances
  const balanceA = await tokenA.balanceOf(deployer.address);
  const balanceB = await tokenB.balanceOf(deployer.address);
  console.log(`\nToken A balance: ${ethers.formatEther(balanceA)}`);
  console.log(`Token B balance: ${ethers.formatEther(balanceB)}`);

  if (balanceA < amountA || balanceB < amountB) {
    throw new Error("Insufficient token balance");
  }

  // Approve tokens
  console.log("\nApproving tokens...");
  const approveA = await tokenA.approve(ammAddress, amountA);
  await approveA.wait();
  const approveB = await tokenB.approve(ammAddress, amountB);
  await approveB.wait();
  console.log("✅ Approvals confirmed");

  // Add liquidity
  console.log("\nAdding liquidity to AMM...");
  const tx = await amm.addLiquidity(amountA, amountB, deployer.address);
  await tx.wait();

  console.log("✅ Liquidity added successfully!");
  
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

