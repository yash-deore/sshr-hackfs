import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import networkMapping from '../constants/NetworkMapping.json';
import { Card } from '@mantine/core';
import { ethers } from 'ethers';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import axios from 'axios';

import healthDataABI from '../constants/HealthDataNFT.json';

export default function Nft() {
  const chainId = 80001;
  const [account, setAccount] = useState('');
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  const [nftHolder, setNftHolder] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [uri, setUri] = useState(
    'ipfs://QmaJ2bALDkHgJP648HhswJoNLwsx4EUuaa9s2ennnFRShv'
  );
  const TOKEN_URI = 'ipfs://QmaJ2bALDkHgJP648HhswJoNLwsx4EUuaa9s2ennnFRShv';
  const NFT_CONTRACT_ADDRESS = '0x4A92819aD686915be11711bB36706b195e0625ff'; //networkMapping[chainId].HealthDataNFT[0];

  async function saveNFTData() {
    await axios
      .post(
        '/api/savedata',
        {},
        {
          params: {
            name: 'bsen',
            datatype: 'Healthdata',
            recent: '07/16/2022',
          },
        }
      )
      .then((response) => {
        console.log('Response:', response);
        //const _data = response.data.data;
        // _data.map((row) => {
        //   row.text == address ? setTwitterMention(true) : '';
        // });
      });
  }

  function getNFTData() {
    data.nftissueds.map((nft) => {
      const { nftHolder, nftAddress, tokenId, uri } = nft;
      console.log('NFT Attributes: ', nftHolder, nftAddress, tokenId, uri);
    });
    setNftAddress(nftAddress);
    setNftHolder(nftHolder);
  }

  async function createNFT() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('Metamaks connected');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const signer = provider.getSigner();
      const healthDataNFTContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        healthDataABI,
        signer
      );
      console.log('signer', signer);
      console.log('Account', account);

      const tokenId = await healthDataNFTContract.mintNft(
        account[0],
        TOKEN_URI
      );
      console.log(`TokenId ${tokenId}`);
    }
  }

  async function init() {
    const ethereum = window.ethereum;
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
    console.log('Account', accounts[0]);
  }

  useEffect(() => {
    init();
  }, [account]);

  return (
    <div>
      {loading || !data ? (
        <div>Loading....</div>
      ) : (
        <div>
          <h1> List of NFTS </h1>
          <Card title={nftHolder} description={nftHolder}>
            <div>NFTAddress: {nftAddress}</div>
          </Card>
          <button onClick={getNFTData}>Get NFT data</button>
          <button onClick={saveNFTData}>Upload Profile</button>
          <button onClick={createNFT}>Create Health Data NFT</button>
        </div>
      )}
    </div>
  );
}
