import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying NFT contract with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const ArcNFT = await ethers.getContractFactory("ArcNFT");
  
  // Deploy with name, symbol, and base URI
  const nft = await ArcNFT.deploy(
    "Arc NFT Collection",
    "ARCNFT",
    "https://api.arcnft.com/metadata/" // Replace with your metadata API
  );

  await nft.waitForDeployment();
  const address = await nft.getAddress();

  console.log("NFT contract deployed to:", address);
  console.log("Contract owner:", deployer.address);
  console.log("Max supply:", await nft.MAX_SUPPLY());
  console.log("Mint price:", ethers.formatEther(await nft.MINT_PRICE()), "USDC");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



