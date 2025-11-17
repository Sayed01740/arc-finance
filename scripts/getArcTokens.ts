import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Checking token balances for:", deployer.address);
  console.log("Native balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // USDC address (Arc testnet)
  const usdcAddress = "0x3600000000000000000000000000000000000000";
  // USDT address (Arc testnet)
  const usdtAddress = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a";
  // TKA address
  const tkaAddress = process.env.TOKEN_A_ADDRESS || "0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496";

  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  try {
    const usdc = await ethers.getContractAt(erc20Abi, usdcAddress);
    const usdcBalance = await usdc.balanceOf(deployer.address);
    const usdcSymbol = await usdc.symbol().catch(() => "USDC");
    console.log(`\n${usdcSymbol} Balance:`, ethers.formatEther(usdcBalance));
  } catch (e) {
    console.log("\nUSDC: Could not check balance (token might not be ERC20)");
  }

  try {
    const usdt = await ethers.getContractAt(erc20Abi, usdtAddress);
    const usdtBalance = await usdt.balanceOf(deployer.address);
    const usdtSymbol = await usdt.symbol().catch(() => "USDT");
    console.log(`${usdtSymbol} Balance:`, ethers.formatEther(usdtBalance));
  } catch (e) {
    console.log("USDT: Could not check balance");
  }

  try {
    const tka = await ethers.getContractAt("TestToken", tkaAddress);
    const tkaBalance = await tka.balanceOf(deployer.address);
    console.log("TKA Balance:", ethers.formatEther(tkaBalance));
  } catch (e) {
    console.log("TKA: Could not check balance");
  }

  console.log("\n💡 To add liquidity, you need:");
  console.log("   • USDC tokens (get from Arc testnet faucet)");
  console.log("   • USDT tokens (get from Arc testnet faucet)");
  console.log("   • TKA tokens (you have these: mint or transfer)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

