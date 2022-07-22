import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
//import { Container, Card, CardGroup, Button } from 'react-bootstrap';
import axios from 'axios';
//import Web3Modal from 'web3modal';
import marketplaceABI from '../constants/HealthDataNFT.json';
import networkMapping from '../constants/networkMapping.json';

import { Container, Card, CardGroup, Button } from '@mantine/core';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [chainId, setChainId] = useState('');
  const [provider, setProvider] = useState('');
  const [account, setAccount] = useState('');
  const [marketplaceContractAddress, setMarketplaceContractAddress] =
    useState('');

  useEffect(() => {
    init();
    //loadNFTs();
  }, []);

  async function init() {
    const ethereum = window.ethereum;

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
    console.log('Account', accounts[0]);

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    let chainIdString = parseInt(chainId).toString();
    setChainId(chainIdString);
    //console.log('chainId', chainIdString);

    const marketplaceContractAddress =
      networkMapping[chainIdString].HealthNFTMarketplace[0];
    setMarketplaceContractAddress(marketplaceContractAddress);
    console.log('Contract Address:', marketplaceContractAddress);
  }

  const loadNFTs = async () => {
    // creating a provider for the frontend to query the unsold items
    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mumbai.g.alchemy.com/v2/_ZX6y7tqU8T5cuLhx3yjPA81SryETLcb'
    );
    const contract = new ethers.Contract(
      marketplaceContractAddress,
      marketplaceABI,
      provider
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState('loaded');
  };

  const buyNft = async (nft) => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceContractAddress,
      marketplaceABI,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  };

  if (loadingState === 'loaded' && !nfts.length)
    return <h1>No items in marketplace</h1>;

  return (
    <Container>
      <div>
        <div>
          <CardGroup>
            {nfts.map((nft, i) => (
              <div key={i}>
                <Card style={{ width: '24rem' }} className="text-center">
                  <Card.Img variant="top" src={nft.image} />
                  <Card.Body>
                    <Card.Title>{nft.name}</Card.Title>
                    <Card.Text>{nft.description}</Card.Text>
                    <Card.Text>
                      <b>{nft.price !== 0 ? nft.price + ' MATIC' : ''}</b>
                    </Card.Text>
                    <Button onClick={() => buyNft(nft)}>Buy NFT</Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </CardGroup>
        </div>
      </div>
    </Container>
  );
}
