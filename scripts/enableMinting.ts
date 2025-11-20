import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  // Check for PRIVATE_KEY first
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not set in environment variables");
    console.log("");
    console.log("Please add your PRIVATE_KEY to the .env file:");
    console.log("  PRIVATE_KEY=your_private_key_here");
    console.log("");
    console.log("This should be the private key of the wallet that deployed the contract.");
    process.exit(1);
  }

  const contractAddress = process.env.NFT_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000' || contractAddress === 'your_contract_address_here') {
    console.error("❌ NFT_CONTRACT_ADDRESS not set in environment variables");
    console.log("");
    console.log("Please set NFT_CONTRACT_ADDRESS in your .env file:");
    console.log("  NFT_CONTRACT_ADDRESS=0x...");
    console.log("");
    console.log("If you haven't deployed the contract yet, run:");
    console.log("  npm run deploy");
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  
  if (!signer) {
    console.error("❌ Failed to get signer. Check your PRIVATE_KEY in .env file.");
    process.exit(1);
  }
  
  console.log("🔍 Checking minting status...");
  console.log("Using account:", signer.address);
  console.log("Contract address:", contractAddress);
  console.log("");

  // Get contract instance
  const ArcNFT = await ethers.getContractFactory("ArcNFT");
  const nft = ArcNFT.attach(contractAddress);

  try {
    // Check current status
    const owner = await nft.owner();
    const mintingEnabled = await nft.mintingEnabled();
    const totalSupply = await nft.totalSupply();
    const maxSupply = await nft.MAX_SUPPLY();
    const mintPrice = await nft.MINT_PRICE();

    console.log("📊 Contract Status:");
    console.log("  Owner:", owner);
    console.log("  Your Address:", signer.address);
    console.log("  Minting Enabled:", mintingEnabled ? "✅ Yes" : "❌ No");
    console.log("  Total Supply:", totalSupply.toString(), "/", maxSupply.toString());
    console.log("  Mint Price:", ethers.formatEther(mintPrice), "USDC");
    console.log("");

    // Check if signer is the owner
    const isOwner = owner.toLowerCase() === signer.address.toLowerCase();
    
    if (!isOwner) {
      console.log("⚠️  WARNING: You are not the contract owner!");
      console.log("  Only the owner can enable/disable minting.");
      console.log("  Please use the owner account to run this script.");
      process.exit(1);
    }

    // Force enable minting (even if already enabled to ensure it's set)
    console.log("🔄 Setting minting to enabled...");
    const tx = await nft.setMintingEnabled(true);
    console.log("  Transaction hash:", tx.hash);
    console.log("  Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("  Block number:", receipt.blockNumber);
    console.log("  Gas used:", receipt.gasUsed.toString());

    // Verify the change
    const newStatus = await nft.mintingEnabled();
    if (newStatus) {
      console.log("");
      console.log("🎉 SUCCESS! Minting has been enabled!");
      console.log("  Users can now mint NFTs from your contract.");
    } else {
      console.log("");
      console.log("⚠️  WARNING: Transaction succeeded but minting is still disabled.");
      console.log("  Please check the contract manually.");
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.reason) {
      console.error("  Reason:", error.reason);
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

