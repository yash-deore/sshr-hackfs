const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  let SCAN_API_KEY = process.env.ETHERSCAN_API_KEY
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  log("----------------------------------------------------")
  const arguments = []
  const nftMarketplace = await deploy("HealthNFTMarketplace", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  if (network.name == "mumbai") {
    SCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
  }

  // Verify the deployment
  if (!developmentChains.includes(network.name) && SCAN_API_KEY) {
    log("Verifying...")
    await verify(nftMarketplace.address, arguments)
  }
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "market"]
