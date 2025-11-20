import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  // Check for PRIVATE_KEY first
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not set in environment variables");
    process.exit(1);
  }

  const contractAddress = process.env.NFT_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error("❌ NFT_CONTRACT_ADDRESS not set in environment variables");
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  
  if (!signer) {
    console.error("❌ Failed to get signer. Check your PRIVATE_KEY in .env file.");
    process.exit(1);
  }

  console.log("🎨 Minting NFT...");
  console.log("Using account:", signer.address);
  console.log("Contract address:", contractAddress);
  console.log("");

  // Get contract instance
  const ArcNFT = await ethers.getContractFactory("ArcNFT");
  const nft = ArcNFT.attach(contractAddress);

  try {
    // Check balance first
    const balance = await ethers.provider.getBalance(signer.address);
    const mintPrice = await nft.MINT_PRICE();
    const totalCost = mintPrice; // For 1 NFT
    
    console.log("💰 Balance Check:");
    console.log("  Your Balance:", ethers.formatEther(balance), "USDC");
    console.log("  Mint Price:", ethers.formatEther(mintPrice), "USDC");
    console.log("  Required:", ethers.formatEther(totalCost), "USDC");
    console.log("");

    if (balance < totalCost) {
      console.error("❌ Insufficient balance!");
      console.error("  Need:", ethers.formatEther(totalCost), "USDC");
      console.error("  Have:", ethers.formatEther(balance), "USDC");
      process.exit(1);
    }

    // Check minting status
    const mintingEnabled = await nft.mintingEnabled();
    if (!mintingEnabled) {
      console.error("❌ Minting is disabled!");
      process.exit(1);
    }

    // Check supply
    const totalSupply = await nft.totalSupply();
    const maxSupply = await nft.MAX_SUPPLY();
    if (totalSupply >= maxSupply) {
      console.error("❌ Max supply reached!");
      process.exit(1);
    }

    console.log("✅ Pre-flight checks passed!");
    console.log("");

    // Mint 1 NFT
    console.log("🔄 Minting NFT...");
    const tx = await nft.mint(1, { value: mintPrice });
    console.log("  Transaction hash:", tx.hash);
    console.log("  Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("  Block number:", receipt.blockNumber);
    console.log("  Gas used:", receipt.gasUsed.toString());
    console.log("");

    // Get the new token ID
    const newTotalSupply = await nft.totalSupply();
    const tokenId = newTotalSupply; // Since we minted 1, the new total supply is the token ID
    
    console.log("🎉 SUCCESS! NFT Minted!");
    console.log("  Token ID:", tokenId.toString());
    console.log("  Owner:", signer.address);
    console.log("  New Total Supply:", newTotalSupply.toString(), "/", maxSupply.toString());
    console.log("");

    // Get token URI
    try {
      const tokenURI = await nft.tokenURI(tokenId);
      console.log("  Token URI:", tokenURI);
    } catch (e) {
      console.log("  Token URI: (Using base URI)");
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.reason) {
      console.error("  Reason:", error.reason);
    }
    if (error.data) {
      console.error("  Data:", error.data);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

