import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NFTIssued as NFTIssuedEvent } from "../generated/HealthDataNFT/HealthDataNFT"
import { NFTIssued } from "../generated/schema"

export function handleNFTIssued(event: NFTIssuedEvent): void {
  let nftIssued = NFTIssued.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  )
  if (!nftIssued) {
    nftIssued = new NFTIssued(
      //id = tokenId + nftAddress
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }

  nftIssued.nftHolder = event.params.nftHolder
  nftIssued.nftAddress = event.params.nftAddress
  nftIssued.tokenId = event.params.tokenId
  nftIssued.uri = event.params.uri

  nftIssued.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}
