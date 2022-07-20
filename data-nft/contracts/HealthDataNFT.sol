//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HealthDataNFT is ERC721URIStorage {
  uint256 private s_tokenCounter;

  //Keeps a mapping of all NFT tokenIDs to who it is issued to
  mapping(uint256 => address) public s_requestIdToOwner;

  //NFT issued
  event NFTIssued(
    address indexed nftHolder,
    address indexed nftAddress,
    uint256 indexed tokenId,
    string uri
  );

  constructor() ERC721("Health Data NFT", "HNFT") {
    s_tokenCounter = 0;
  }

  function mintNft(address senderAddress, string memory _tokenURI) public returns (uint256) {
    s_tokenCounter = s_tokenCounter + 1;

    _safeMint(senderAddress, s_tokenCounter);
    s_requestIdToOwner[s_tokenCounter] = senderAddress;
    _setTokenURI(s_tokenCounter, _tokenURI);

    emit NFTIssued(senderAddress, address(this), s_tokenCounter, _tokenURI);

    return s_tokenCounter;
  }

  //Get the URI for the specific NFT
  function getTokenURI(uint256 index) public view returns (string memory) {
    return tokenURI(index);
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
