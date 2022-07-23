import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import networkMapping from '../constants/networkMapping.json';
import { Card } from '@mantine/core';
import { ethers } from 'ethers';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import axios from 'axios';
import marketplaceABI from '../constants/HealthNFTMarketplace.json';
import nftABI from '../constants/HealthDataNFT.json';

export default function Nft() {
  //const chainId = 80001;
  const [chainId, setChainId] = useState('');
  const [provider, setProvider] = useState('');
  const [account, setAccount] = useState('');
  const [nftContractAddress, setNftContractAddress] = useState('');
  const [marketplaceAddress, setMarketplaceAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const PRICE = ethers.utils.parseEther('0.01');

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  //console.log('DATA', data);
  const [nftHolder, setNftHolder] = useState('');
  const [nftAddress, setNftAddress] = useState('');

  //This token uri has name, description, image and health data as attributes
  //to view in browser: https://ipfs.io/ipfs/Qme2PXtCzcHABYpvhnJRpW6A7xrVcX91kdCi5jYu6ECcQU
  const TOKEN_URI = 'ipfs://Qme2PXtCzcHABYpvhnJRpW6A7xrVcX91kdCi5jYu6ECcQU';

  //example data to save to IPFS
  async function uploadDataToIPFS() {
    await axios
      .post(
        '/api/savedata',
        {},
        {
          params: {
            name: 'John Smith',
            description: 'MyHealthdata1',
            image: 'ipfs://QmSvRgYrLRuZ3arjtAnfcWhPm23sBkU9SUPZ88YXf3jHfU',
            attributes: '[{"height":"160","weight":"100", "bp":"120"}]',
          },
        }
      )
      .then((response) => {
        console.log('Response:', response);
        const _data = response.data.response.IpfsHash;
        console.log('IpfsHash:', _data);
        // _data.map((row) => {
        // });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function createNFT() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('Metamaks connected');
      const signer = provider.getSigner();
      const healthDataNFTContract = new ethers.Contract(
        nftContractAddress,
        nftABI,
        signer
      );

      const tx = await healthDataNFTContract.mintNft(account, TOKEN_URI);
      await tx.wait(1);
      console.log(`Tx value ${JSON.stringify(tx)}`);
    }
  }

  async function listNFT() {
    console.log('List NFT');
    const signer = provider.getSigner();
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      marketplaceABI,
      signer
    );

    const tx = await marketplaceContract.listItem(
      nftContractAddress,
      tokenId,
      PRICE,
      {
        gasLimit: 3e6,
      }
    );
    await tx.wait(1);
    console.log(`Tx value ${JSON.stringify(tx)}`);
  }https://gateway.pinata.cloud/ipfs/QmcLtw6iLAV8SJ7KFPzQA8a8egb2RmYzrwCvudcWSEXpbs
    setChainId(chainIdString);

    let nftContractAddress = networkMapping[chainIdString].HealthDataNFT[0];
    setNftContractAddress(nftContractAddress);
    //console.log('Contract Address:', nftContractAddress);

    const marketplaceAddress =
      networkMapping[chainIdString].HealthNFTMarketplace[0];
    setMarketplaceAddress(marketplaceAddress);
  }

  useEffect(() => {
    init();
  }, [account]);

  return (
    <div>
      <div>
        <button onClick={uploadDataToIPFS}>upload health data to IPFS</button>{' '}
        <button onClick={createNFT}>Create Health Data NFT</button>
        <button onClick={listNFT}>LIST health data NFT for Sale</button>
      </div>
    </div>
  );
}
