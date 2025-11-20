// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArcNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.01 ether; // 0.01 USDC on Arc
    uint256 public maxMintPerTx = 10;
    bool public mintingEnabled = true;
    
    string public baseTokenURI;
    string public contractURI;
    
    mapping(address => uint256) public mintedCount;
    
    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event CustomNFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
        _nextTokenId = 1; // Start token IDs at 1
    }
    
    function mint(uint256 quantity) public payable {
        require(mintingEnabled, "Minting is disabled");
        require(quantity > 0 && quantity <= maxMintPerTx, "Invalid quantity");
        require(
            _nextTokenId + quantity - 1 <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        require(msg.value >= MINT_PRICE * quantity, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId;
            _safeMint(msg.sender, tokenId);
            mintedCount[msg.sender]++;
            emit Minted(msg.sender, tokenId, tokenURI(tokenId));
            _nextTokenId++;
        }
    }
    
    // New function: Mint with custom URI (for user-created NFTs)
    function mintWithURI(string memory tokenURI_) public payable {
        require(mintingEnabled, "Minting is disabled");
        require(_nextTokenId <= MAX_SUPPLY, "Exceeds max supply");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(bytes(tokenURI_).length > 0, "Token URI cannot be empty");
        
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        mintedCount[msg.sender]++;
        emit CustomNFTMinted(msg.sender, tokenId, tokenURI_);
        _nextTokenId++;
    }
    
    function mintTo(address to, uint256 quantity) public payable {
        require(mintingEnabled, "Minting is disabled");
        require(quantity > 0 && quantity <= maxMintPerTx, "Invalid quantity");
        require(
            _nextTokenId + quantity - 1 <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        require(msg.value >= MINT_PRICE * quantity, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId;
            _safeMint(to, tokenId);
            mintedCount[to]++;
            emit Minted(to, tokenId, tokenURI(tokenId));
            _nextTokenId++;
        }
    }
    
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
    
    function setContractURI(string memory _contractURI) public onlyOwner {
        contractURI = _contractURI;
    }
    
    function setMintingEnabled(bool _enabled) public onlyOwner {
        mintingEnabled = _enabled;
    }
    
    function setMaxMintPerTx(uint256 _max) public onlyOwner {
        maxMintPerTx = _max;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
