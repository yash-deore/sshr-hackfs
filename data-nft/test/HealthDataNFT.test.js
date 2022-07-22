const { assert, expect } = require("chai")
const { ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Nft Marketplace Unit Tests", function () {
      let healthDataNFT, healthNFTMarketplace, user
      const PRICE = ethers.utils.parseEther("0.1")
      const TOKEN_ID = 1
      const TOKEN_URI = "tokenURI"

      beforeEach(async function () {
        const { deployer } = await getNamedAccounts()
        user = deployer
        healthDataNFTFactory = await ethers.getContractFactory("HealthDataNFT")
        healthDataNFT = await healthDataNFTFactory.deploy()

        mktplaceFactory = await ethers.getContractFactory("HealthNFTMarketplace")
        healthNFTMarketplace = await mktplaceFactory.deploy()

        const tx = await await healthDataNFT.mintNft(user, TOKEN_URI)
        await tx.wait(1)

        //aprove to list the Token in Marketplace
        await healthDataNFT.approve(healthNFTMarketplace.address, TOKEN_ID)
      })

      describe("HealthDataNFT", function () {
        it("should display name", async () => {
          const contractName = await healthDataNFT.name()
          const expectedValue = "Health Data NFT"
          assert.equal(contractName, expectedValue)
        })

        it("allows to mint NFT", async function () {
          const tokenCounter = await healthDataNFT.getTokenCounter()
          assert.equal(tokenCounter.toString(), "1")
        })
      })

      describe("listItem", function () {
        it("emits an event after listing an item", async function () {
          expect(
            await healthNFTMarketplace.listItem(healthDataNFT.address, TOKEN_ID, PRICE)
          ).to.emit("ItemListed")
        })
      })

      //
    })
