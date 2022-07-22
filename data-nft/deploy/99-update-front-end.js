const { ethers, network } = require("hardhat")
const {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  frontEndContractsFile,
  frontEndAbiLocation,
} = require("../helper-hardhat-config")

require("dotenv").config()
const fs = require("fs")

const waitBlockConfirmations = developmentChains.includes(network.name)
  ? 1
  : VERIFICATION_BLOCK_CONFIRMATIONS

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("updating front-end...")
    await updateContractAddresses()
    await updateAbi()
  }
}

async function updateAbi() {
  const healthDataNFT = await ethers.getContract("HealthDataNFT")
  fs.writeFileSync(
    `${frontEndAbiLocation}HealthDataNFT.json`,
    healthDataNFT.interface.format(ethers.utils.FormatTypes.json)
  )

  const healthNFTMarketplace = await ethers.getContract("HealthNFTMarketplace")
  fs.writeFileSync(
    `${frontEndAbiLocation}HealthNFTMarketplace.json`,
    healthNFTMarketplace.interface.format(ethers.utils.FormatTypes.json)
  )

  //
}

async function updateContractAddresses() {
  let chainId = 31337
  if (network.name != "localhost") {
    chainId = network.config.chainId.toString()
    console.log("Chain ID:", chainId)
  }
  const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
  if (typeof contractAddresses == "undefined") {
    console.log("EMPTY file")
  }

  const healthDataNFT = await ethers.getContract("HealthDataNFT")
  const healthNFTMarketplace = await ethers.getContract("HealthNFTMarketplace")

  contractAddresses[chainId] = {
    HealthDataNFT: [healthDataNFT.address],
    HealthNFTMarketplace: [healthNFTMarketplace.address],
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ("all", "frontend")
