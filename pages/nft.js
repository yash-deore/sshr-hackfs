import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import networkMapping from '../constants/networkMapping.json';
import { Card } from '@mantine/core';
import { ethers } from 'ethers';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import axios from 'axios';

import healthDataABI from '../constants/HealthDataNFT.json';

export default function Nft() {
  //const chainId = 80001;
  const [chainId, setChainId] = useState('');
  const [provider, setProvider] = useState('');
  const [account, setAccount] = useState('');
  const [nftContractAddress, setNftContractAddress] = useState('');

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  //console.log('DATA', data);
  const [nftHolder, setNftHolder] = useState('');
  const [nftAddress, setNftAddress] = useState('');

  //This token uri has name, description, image and health data as attributes
  //to view in browser: https://ipfs.io/ipfs/Qme2PXtCzcHABYpvhnJRpW6A7xrVcX91kdCi5jYu6ECcQU
  const TOKEN_URI = 'ipfs://Qme2PXtCzcHABYpvhnJRpW6A7xrVcX91kdCi5jYu6ECcQU';

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
        healthDataABI,
        signer
      );

      const tx = await healthDataNFTContract.mintNft(account, TOKEN_URI);
      await tx.wait(1);
      console.log(`Tx value ${JSON.stringify(tx)}`);
    }
  }

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

    let nftContractAddress = networkMapping[chainIdString].HealthDataNFT[0];
    setNftContractAddress(nftContractAddress);
    //console.log('Contract Address:', nftContractAddress);
  }

  useEffect(() => {
    init();
  }, [account]);

  return (
    <div>
      <div>
        <button onClick={uploadDataToIPFS}>upload health data to IPFS</button>{' '}
        <button onClick={createNFT}>Create Health Data NFT</button>
        <h1> NFTS listed in Marketplace </h1>
      </div>
      {loading || !data ? (
        <div>Loading....</div>
      ) : (
        data.activeItems.map((nft, i) => {
          //console.log(nft);
          const { price, nftAddress, tokenId, seller } = nft;
          return (
            <div key={i}>
              ID: {tokenId} {'  '} Owner: {seller} {'  '} To Buy: {price}
            </div>
          );
        })
      )}
    </div>
  );
}
