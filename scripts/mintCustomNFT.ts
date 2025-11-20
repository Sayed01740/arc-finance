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

  console.log("🎨 Minting Custom NFT with URI...");
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
    
    console.log("💰 Balance Check:");
    console.log("  Your Balance:", ethers.formatEther(balance), "USDC");
    console.log("  Mint Price:", ethers.formatEther(mintPrice), "USDC");
    console.log("");

    if (balance < mintPrice) {
      console.error("❌ Insufficient balance!");
      process.exit(1);
    }

    // Check minting status
    const mintingEnabled = await nft.mintingEnabled();
    if (!mintingEnabled) {
      console.error("❌ Minting is disabled!");
      process.exit(1);
    }

    // Create a test metadata URI (like the create page does)
    const testMetadata = {
      name: "Test Custom NFT",
      description: "A test NFT minted via script",
      image: "https://via.placeholder.com/500",
      attributes: [
        { trait_type: "Type", value: "Test" },
        { trait_type: "Rarity", value: "Common" }
      ]
    };

    // Encode as data URI (like frontend does)
    const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(testMetadata)).toString('base64')}`;
    
    console.log("📝 Metadata:");
    console.log("  Name:", testMetadata.name);
    console.log("  Description:", testMetadata.description);
    console.log("  Token URI:", tokenURI.substring(0, 100) + "...");
    console.log("");

    console.log("✅ Pre-flight checks passed!");
    console.log("");

    // Mint with custom URI
    console.log("🔄 Minting NFT with custom URI...");
    const tx = await nft.mintWithURI(tokenURI, { value: mintPrice });
    console.log("  Transaction hash:", tx.hash);
    console.log("  Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed!");
    console.log("  Block number:", receipt.blockNumber);
    console.log("  Gas used:", receipt.gasUsed.toString());
    console.log("");

    // Get the new token ID
    const newTotalSupply = await nft.totalSupply();
    const tokenId = newTotalSupply;
    
    console.log("🎉 SUCCESS! Custom NFT Minted!");
    console.log("  Token ID:", tokenId.toString());
    console.log("  Owner:", signer.address);
    console.log("  New Total Supply:", newTotalSupply.toString());
    console.log("");

    // Get token URI to verify
    const storedURI = await nft.tokenURI(tokenId);
    console.log("  Stored Token URI:", storedURI.substring(0, 150) + "...");
    console.log("");

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

