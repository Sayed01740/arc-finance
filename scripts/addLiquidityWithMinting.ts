import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Adding liquidity with automatic token minting...");
  console.log("Account:", deployer.address);
  console.log("Native balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const usdcAddress = "0x3600000000000000000000000000000000000000";
  const usdtAddress = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a";
  const tkaAddress = process.env.TOKEN_A_ADDRESS || "0xf8BF7E1938886b6d8D7e94A93FDd7d857E425496";

  const amountUSDC = ethers.parseEther("100");
  const amountUSDT = ethers.parseEther("100");
  const amountTKA = ethers.parseEther("100");

  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address, uint256) returns (bool)",
    "function transferFrom(address, address, uint256) returns (bool)",
    "function mint(address, uint256) returns (bool)",
    "function decimals() view returns (uint8)",
  ];

  // Check if USDC has mint function (likely not, but try)
  try {
    const usdc = await ethers.getContractAt(erc20Abi, usdcAddress);
    const usdcBalance = await usdc.balanceOf(deployer.address);
    console.log(`\nUSDC Balance: ${ethers.formatEther(usdcBalance)}`);
    
    if (usdcBalance < amountUSDC) {
      console.log("⚠️  Insufficient USDC. Trying to mint...");
      try {
        await usdc.mint(deployer.address, amountUSDC);
        console.log("✅ USDC minted!");
      } catch (e) {
        console.log("❌ USDC cannot be minted. Need to get tokens from faucet.");
        throw new Error("Insufficient USDC. Please get tokens from Arc testnet faucet.");
      }
    }
  } catch (e: any) {
    console.log("⚠️  USDC might not support standard ERC20. Skipping...");
    console.log("Error:", e.message);
  }

  // Check if USDT has mint function
  try {
    const usdt = await ethers.getContractAt(erc20Abi, usdtAddress);
    const usdtBalance = await usdt.balanceOf(deployer.address);
    console.log(`USDT Balance: ${ethers.formatEther(usdtBalance)}`);
    
    if (usdtBalance < amountUSDT) {
      console.log("⚠️  Insufficient USDT. Trying to mint...");
      try {
        await usdt.mint(deployer.address, amountUSDT);
        console.log("✅ USDT minted!");
      } catch (e) {
        console.log("❌ USDT cannot be minted. Need to get tokens from faucet.");
        throw new Error("Insufficient USDT. Please get tokens from Arc testnet faucet.");
      }
    }
  } catch (e: any) {
    console.log("⚠️  USDT might not support standard ERC20. Skipping...");
    console.log("Error:", e.message);
  }

  // Mint TKA if needed (we have TestToken with mint function)
  try {
    const tka = await ethers.getContractAt("TestToken", tkaAddress);
    const tkaBalance = await tka.balanceOf(deployer.address);
    console.log(`TKA Balance: ${ethers.formatEther(tkaBalance)}`);
    
    if (tkaBalance < amountTKA) {
      console.log("⚠️  Insufficient TKA. Minting...");
      const mintTx = await tka.mint(deployer.address, amountTKA);
      await mintTx.wait();
      console.log("✅ TKA minted!");
    }
  } catch (e: any) {
    console.log("❌ Could not mint TKA:", e.message);
  }

  console.log("\n✅ All tokens ready! Now adding liquidity...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

