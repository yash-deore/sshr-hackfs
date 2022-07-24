const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function mintHealthDataNFT() {
  const signer = (await ethers.getSigners())[0]
  const tokenUri = "https://ipfs.io/ipfs/QmZiKoMAs9cXnHVphTUtQiyj8JJNjdK3JspYFASV727yte"
  const healthDataNFT = await ethers.getContract("HealthDataNFT")
  console.log(`Minting data NFT... for signer ${signer.address}`)
  const mintTx = await healthDataNFT.mintNft(signer.address, tokenUri)
  const mintTxReceipt = await mintTx.wait(4)
  console.log(
    `Minted tokenId ${mintTxReceipt.events[0].args.tokenId.toString()} from contract: ${
      healthDataNFT.address
    }`
  )
  if (network.config.chainId == 31337) {
    // Moralis has a hard time if you move more than 1 block!
    await moveBlocks(2, (sleepAmount = 1000))
  }
}

mintHealthDataNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
