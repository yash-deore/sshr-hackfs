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
  console.log('DATA', data);
  const [nftHolder, setNftHolder] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [uri, setUri] = useState(
    'ipfs://QmaJ2bALDkHgJP648HhswJoNLwsx4EUuaa9s2ennnFRShv'
  );
  const TOKEN_URI = 'ipfs://QmaJ2bALDkHgJP648HhswJoNLwsx4EUuaa9s2ennnFRShv';

  async function uploadDataToIPFS() {
    await axios
      .post(
        '/api/savedata',
        {},
        {
          params: {
            name: 'priya',
            datatype: 'MyHealthdata6',
            recent: '07/21/2022',
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
    data.activeItems.map((nft) => {
      const { nftAddress, tokenId } = nft;
      console.log('NFT Attributes: ', nftAddress, tokenId);
    });
    setNftAddress(nftAddress);
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
      {loading || !data ? (
        <div>Loading....</div>
      ) : (
        <div>
          <h1> List of NFTS </h1>
          <Card title={nftHolder} description={nftHolder}>
            <div>NFTAddress: {nftAddress}</div>
          </Card>
          <button onClick={getNFTData}>Get NFT data</button>
          <button onClick={uploadDataToIPFS}>upload health data to IPFS</button>
          <button onClick={createNFT}>Create Health Data NFT</button>
        </div>
      )}
    </div>
  );
}
