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
    const maxMintPerTx = await nft.maxMintPerTx();

    console.log("📊 Contract Status:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Owner:", owner);
    console.log("  Your Address:", signer.address);
    console.log("  Is Owner:", owner.toLowerCase() === signer.address.toLowerCase() ? "✅ Yes" : "❌ No");
    console.log("");
    console.log("  Minting Status:", mintingEnabled ? "✅ ENABLED" : "❌ DISABLED");
    console.log("  Total Supply:", totalSupply.toString(), "/", maxSupply.toString());
    console.log("  Remaining:", (Number(maxSupply) - Number(totalSupply)).toString());
    console.log("  Mint Price:", ethers.formatEther(mintPrice), "USDC");
    console.log("  Max Mint Per TX:", maxMintPerTx.toString());
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    if (!mintingEnabled) {
      const isOwner = owner.toLowerCase() === signer.address.toLowerCase();
      if (isOwner) {
        console.log("💡 Minting is disabled, but you are the owner!");
        console.log("   Run: npm run enable-minting");
        console.log("   Or: npx hardhat run scripts/enableMinting.ts --network arc");
      } else {
        console.log("⚠️  Minting is disabled and you are not the owner.");
        console.log("   Contact the contract owner to enable minting.");
      }
    } else {
      console.log("✅ Minting is enabled and ready to use!");
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.reason) {
      console.error("  Reason:", error.reason);
    }
    if (error.message.includes("could not detect network")) {
      console.error("\n💡 Tip: Make sure you have configured the network in hardhat.config.ts");
      console.error("   And set ARC_RPC_URL in your .env file");
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

