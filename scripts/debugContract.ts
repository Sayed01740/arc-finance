import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("❌ Contract address not set");
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  console.log("🔍 Comprehensive Contract Debug");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Account:", signer.address);
  console.log("Contract:", contractAddress);
  console.log("");

  const ArcNFT = await ethers.getContractFactory("ArcNFT");
  const nft = ArcNFT.attach(contractAddress);

  try {
    // 1. Verify MINT_PRICE
    console.log("1️⃣  MINT_PRICE Verification:");
    const mintPrice = await nft.MINT_PRICE();
    const mintPriceFormatted = ethers.formatEther(mintPrice);
    console.log("   Raw value:", mintPrice.toString(), "wei");
    console.log("   Formatted:", mintPriceFormatted, "USDC");
    console.log("   Expected: 0.01 USDC");
    console.log("   ✅ Match:", mintPriceFormatted === "0.01" ? "YES" : "NO");
    console.log("");

    // 2. Check contract state
    console.log("2️⃣  Contract State:");
    const mintingEnabled = await nft.mintingEnabled();
    const totalSupply = await nft.totalSupply();
    const maxSupply = await nft.MAX_SUPPLY();
    const maxMintPerTx = await nft.maxMintPerTx();
    const owner = await nft.owner();
    
    console.log("   Minting Enabled:", mintingEnabled ? "✅ YES" : "❌ NO");
    console.log("   Total Supply:", totalSupply.toString());
    console.log("   Max Supply:", maxSupply.toString());
    console.log("   Remaining:", (Number(maxSupply) - Number(totalSupply)).toString());
    console.log("   Max Mint Per TX:", maxMintPerTx.toString());
    console.log("   Owner:", owner);
    console.log("   Is Owner:", owner.toLowerCase() === signer.address.toLowerCase() ? "✅ YES" : "❌ NO");
    console.log("");

    // 3. Test price calculation
    console.log("3️⃣  Price Calculation Test:");
    const testQuantity = 5;
    const expectedCost = mintPrice * BigInt(testQuantity);
    console.log("   Quantity:", testQuantity);
    console.log("   Price per NFT:", ethers.formatEther(mintPrice), "USDC");
    console.log("   Total Cost:", ethers.formatEther(expectedCost), "USDC");
    console.log("   Raw Cost:", expectedCost.toString(), "wei");
    console.log("");

    // 4. Check balance
    console.log("4️⃣  Balance Check:");
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("   Balance:", ethers.formatEther(balance), "USDC");
    console.log("   Can mint 1 NFT:", balance >= mintPrice ? "✅ YES" : "❌ NO");
    console.log("   Can mint", testQuantity, "NFTs:", balance >= expectedCost ? "✅ YES" : "❌ NO");
    console.log("");

    // 5. Test metadata creation (simulate)
    console.log("5️⃣  Metadata Creation Test:");
    const testMetadata = {
      name: "Test NFT",
      description: "Test description",
      image: "https://via.placeholder.com/500",
      attributes: [{ trait_type: "Test", value: "Value" }]
    };
    const jsonString = JSON.stringify(testMetadata);
    const base64 = Buffer.from(jsonString).toString('base64');
    const dataURI = `data:application/json;base64,${base64}`;
    console.log("   Metadata length:", jsonString.length, "bytes");
    console.log("   Data URI length:", dataURI.length, "characters");
    console.log("   Valid URI:", dataURI.length > 0 ? "✅ YES" : "❌ NO");
    console.log("   Preview:", dataURI.substring(0, 100) + "...");
    console.log("");

    // 6. Contract function signatures
    console.log("6️⃣  Function Signatures:");
    console.log("   mint(uint256) - payable");
    console.log("   mintWithURI(string) - payable");
    console.log("   MINT_PRICE() - view");
    console.log("   totalSupply() - view");
    console.log("   MAX_SUPPLY() - view");
    console.log("   mintingEnabled() - view");
    console.log("");

    // 7. Network info
    console.log("7️⃣  Network Information:");
    const network = await ethers.provider.getNetwork();
    console.log("   Chain ID:", network.chainId.toString());
    console.log("   Expected: 5042002 (Arc Testnet)");
    console.log("   Match:", network.chainId.toString() === "5042002" ? "✅ YES" : "❌ NO");
    console.log("");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Debug complete!");
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.reason) {
      console.error("   Reason:", error.reason);
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

