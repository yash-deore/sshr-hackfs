import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "../global/store";
import { useQuery, gql } from "@apollo/client";
import { ethers } from "ethers";
import axios from "axios";
import marketplaceABI from "../constants/HealthNFTMarketplace.json";
import nftABI from "../constants/HealthDataNFT.json";
import networkMapping from "../constants/networkMapping.json";
import { Container, Card, CardGroup, Button, Title } from "@mantine/core";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import NFTBox from "../components/NFTBox";

export default function Home() {
  const router = useRouter();
  const [globalStore, setGlobalStore] = useGlobalContext();
  const { authenticated, patientShares } = globalStore;
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [chainId, setChainId] = useState("");
  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [marketplaceAddress, setMarketplaceAddress] = useState("");
  const [nftContract, setNftContract] = useState("");
  const [marketplaceContract, setMarketplaceContract] = useState("");
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  useEffect(() => {
    if (authenticated === false)
      router.push("/profile", null, { shallow: true });
    else init();
  }, []);

  async function init() {
    const ethereum = window.ethereum;

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    //console.log('Market place Account', accounts[0]);

    let chainId = await ethereum.request({ method: "eth_chainId" });
    let chainIdString = parseInt(chainId).toString();
    setChainId(chainIdString);
    console.log("chainId", chainIdString);

    if (!networkMapping[chainIdString]) {
      debugger;
      console.error("no networkMapping for chain " + chainIdString, {
        networkMapping,
      });
    }
    const marketplaceAddress =
      networkMapping[chainIdString].HealthNFTMarketplace[0];
    setMarketplaceAddress(marketplaceAddress);
    console.log("Marketplace Address:", marketplaceAddress);

    let nftContractAddress = networkMapping[chainIdString].HealthDataNFT[0];
    setNftContractAddress(nftContractAddress);
    //console.log('Contract Address:', nftContractAddress);
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1>No items in marketplace</h1>;

  function ListingAllNFTs() {
    if (loading || !listedNfts) {
      return <h1>Loading ...</h1>;
    } else {
      console.log(listedNfts);
      return listedNfts.activeItems.map((nft, i) => {
        //console.log(nft);
        const { price, nftAddress, tokenId, seller } = nft;
        //console.log('Market place NFT Address: ', nftAddress);
        if (tokenId > 11) {
          return (
            <div key={i}>
              <NFTBox
                price={price}
                nftAddress={nftAddress}
                tokenId={tokenId}
                seller={seller}
                provider={provider}
                account={account}
                marketplaceAddress={marketplaceAddress}
                key={`${nftAddress}${tokenId}`}
              />
            </div>
          );
        }
      });
    }
  }

  return (
    <Container>
      <Title style={{ margin: "3% 0 1% 0" }} order={2}>
        Data Market Place
      </Title>
      <div>{ListingAllNFTs()}</div>

      {/* {loading || !listedNfts ? (
          <div>Loading....</div>
        ) : (
          listedNfts.activeItems.map((nft, i) => {
            //console.log(nft);
            const { price, nftAddress, tokenId, seller } = nft;
            //console.log('Market place NFT Address: ', nftAddress);
            return (
              <div key={i}>
                ID: {tokenId} {'  '} Owner: {seller} {'  '} To view data, you
                pay: {ethers.utils.formatUnits(price, 'ether')} ETH
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  seller={seller}
                  provider={provider}
                  account={account}
                  marketplaceAddress={marketplaceAddress}
                  key={`${nftAddress}${tokenId}`}
                />
              </div>
            );
          })
        )} */}
    </Container>
  );
}
