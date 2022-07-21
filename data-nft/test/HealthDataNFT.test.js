const { assert, expect } = require("chai")
const { ethers, getNamedAccounts } = require("hardhat")

describe("HealthDataNFT", function () {
  let healthDataNFT, user

  beforeEach(async function () {
    const { deployer } = await getNamedAccounts()
    user = deployer
    healthDataNFTFactory = await ethers.getContractFactory("HealthDataNFT")
    healthDataNFT = await healthDataNFTFactory.deploy()
  })

  it("should display name", async () => {
    const contractName = await healthDataNFT.name()
    const expectedValue = "Health Data NFT"
    assert.equal(contractName, expectedValue)
  })

  it("allows to mint NFT", async function () {
    const tx = await healthDataNFT.mintNft(user, "tokenURI")
    await tx.wait(1)
    const tokenCounter = await healthDataNFT.getTokenCounter()

    assert.equal(tokenCounter.toString(), "1")
  })

  //
})
