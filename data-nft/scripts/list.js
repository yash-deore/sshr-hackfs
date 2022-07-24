const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1")

async function List() {
  const tokenId = 6 //fist NFT owned by me
  console.log("Get Health Data Marketplace contract")
  const healthNFTMarketplace = await ethers.getContract("HealthNFTMarketplace")

  console.log("Get Health Data NFT  contract")
  const healthDataNFT = await ethers.getContract("HealthDataNFT")

  // const mintTx = await healthDataNFT.mintNft()
  // const mintTxReceipt = await mintTx.wait(1)
  // const tokenId = mintTxReceipt.events[0].args.tokenId

  //Add first token to NFT market place
  console.log("Approve marketplace to list NFT")
  const approvalTx = await healthDataNFT.approve(healthNFTMarketplace.address, tokenId)
  await approvalTx.wait(4)
  console.log("Listing NFT...")
  const tx = await healthNFTMarketplace.listItem(healthDataNFT.address, tokenId, PRICE, {
    gasLimit: 3e6,
  })
  await tx.wait(4)
  console.log("NFT Listed!")
  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    console.log("MOVE blocks")
    await moveBlocks(1, (sleepAmount = 1000))
  }
}

List()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
