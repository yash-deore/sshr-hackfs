import { useState, useEffect } from 'react';
import nftABI from '../constants/HealthDataNFT.json';
import marketplaceABI from '../constants/HealthNFTMarketplace.json';
import networkMapping from '../constants/networkMapping.json';

import Image from 'next/image';
import { Card } from '@mantine/core';
import { ethers } from 'ethers';

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = '...';
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  seller,
  provider,
  account,
  marketplaceAddress,
}) {
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [healthData, setHealthData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);
  const [paidFlag, setPaidFlag] = useState(false);
  const [nfts, setNfts] = useState([]);
  //const [loadingState, setLoadingState] = useState('not-loaded');
  //const [chainId, setChainId] = useState('');
  console.log('Params:', nftAddress, tokenId, price);

  async function getTokenURI() {
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftAddress, nftABI, signer);

    const tokenURI = await nftContract.getTokenURI(tokenId);
    return tokenURI;
  }

  async function buyItem() {
    console.log('Buy item');

    setPaidFlag(!paidFlag);

    // const signer = provider.getSigner();
    // const marketplaceContract = new ethers.Contract(
    //   marketplaceAddress,
    //   marketplaceABI,
    //   signer
    // );

    // const tx = await marketplaceContract.buyItem(nftAddress, tokenId);
    // await tx.wait(1);
    // console.log(`Buy item Tx value ${JSON.stringify(tx)}`);
  }

  async function updateNFTBoxUI() {
    const tokenURI = await getTokenURI();
    console.log(`TokenURI ${tokenURI} TokenID ${tokenId}`);

    if (typeof tokenURI != 'undefined') {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
      // We are going to cheat a little here...
      const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const tokenURIResponse = await (await fetch(requestURL)).json();

      console.log('tokenURIResponse.image:', tokenURIResponse.image);
      if (typeof tokenURIResponse.image != 'undefined') {
        const imageURI = tokenURIResponse.image;
        if (typeof imageURI != 'undefined') {
          const imageURIURL = imageURI.replace(
            'ipfs://',
            'https://ipfs.io/ipfs/'
          );
          setImageURI(imageURIURL);
        }
      }

      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      setHealthData(tokenURIResponse.attributes);
      console.log('My Health Data', tokenURIResponse.attributes);

      // We could render the Image on our sever, and just call our sever.
      // For testnets & mainnet -> use moralis server hooks
      // Have the world adopt IPFS
      // Build our own IPFS gateway
    }
    // get the tokenURI
    // using the image tag from the tokenURI, get the image
  }

  useEffect(() => {
    updateNFTBoxUI();
  }, [provider]);

  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? 'you'
    : truncateStr(seller || '', 15);

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        });
  };

  const handleBuyItemSuccess = () => {
    console.log('ITEM BOUIGHT............');
  };

  return (
    <div>
      {!paidFlag ? (
        <div>pay to view health data</div>
      ) : (
        <div>
          <h1>Health Data Viewer</h1>
          <div>Height: {healthData}</div>
        </div>
      )}
      <div>
        {imageURI ? (
          <div>
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>

                  <div className="italic text-sm">
                    Owned by {formattedSellerAddress}
                  </div>

                  <Image
                    loader={() => imageURI}
                    src={imageURI}
                    height="200"
                    width="200"
                  />

                  <div className="font-bold">
                    {ethers.utils.formatUnits(0, 'ether')} ETH
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>no image for this NFT</div>
        )}
      </div>
    </div>
  );
}
