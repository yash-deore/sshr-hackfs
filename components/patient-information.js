import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NFTStorage, Blob } from 'nft.storage';
const nftStorageToken = process.env.NFT_STORAGE_KEY;

import {
  Card,
  Image,
  Text,
  Group,
  Button,
  createStyles,
  Table,
  Avatar,
  Container,
  Title,
  Accordion,
} from '@mantine/core';
import {
  Cake,
  GenderMale,
  HeartHandshake,
  Mail,
  Phone,
  User,
} from 'tabler-icons-react';
import { PatientBasicInformation } from './patient-basic-information';
import PatientPersonalInformation from './patient-personal-information';
import { PatientMedicalInformation } from './patient-medical-information';

import { showNotification, updateNotification } from '@mantine/notifications';
import { AlertCircle, Check } from 'tabler-icons-react';

//import { useQuery, gql } from "@apollo/client";
import networkMapping from '../constants/networkMapping.json';
import { ethers } from 'ethers';
//import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
//import axios from "axios";
import healthDataABI from '../constants/HealthDataNFT.json';
import { useAccount } from 'wagmi';
import marketplaceABI from '../constants/HealthNFTMarketplace.json';

import { create as ipfsHttpClient } from 'ipfs-http-client';
const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const useStyles = createStyles((theme, _params, getRef) => {
  const control = getRef('control');

  return {
    wrapper: {
      paddingTop: theme.spacing.xl * 2,
      paddingBottom: theme.spacing.xl * 2,
      minHeight: 650,
    },

    title: {
      fontWeight: 400,
      marginBottom: theme.spacing.xl * 1.5,
    },

    control: {
      ref: control,
      marginTop: '2%',
    },

    item: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,

      border: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[3]
      }`,
    },

    itemOpened: {
      [`& .${control}`]: {
        color:
          theme.colors[theme.primaryColor][
            theme.colorScheme === 'dark' ? 4 : 6
          ],
      },
    },

    controls: {
      marginTop: theme.spacing.lg,
      display: 'flex',
      justifyContent: 'center',

      '@media (max-width: 520px)': {
        flexDirection: 'column',
      },
    },
  };
});
const PRICE = ethers.utils.parseEther('0.01');

export function PatientInformation({
  name,
  gender,
  date,
  maritalStatus,
  phone,
  mail,
  allergies,
  currentMedications,
  symptoms,
  progressNotes,
  vitalSigns,
}) {
  const { data } = useAccount();
  const router = useRouter();
  const { classes } = useStyles();

  const [patientParameters, setPatientParameters] = useState(null);

  async function SellNFT() {
    showNotification({
      id: 'load-data-sell-nft',
      loading: true,
      title: 'Minting and listing the NFT',
      message: 'Please wait your NFT is being minted and listed.',
      autoClose: false,
      disallowClose: true,
    });

    const attributes = {
      gender,
      date,
      maritalStatus,
      allergies,
      currentMedications,
      symptoms,
      vitalSigns,
    };

    const params = {
      name: 'Anonymous',
      description: 'Health Data',
      image: 'ipfs://QmeK4BXjQUTNka1pRTmWjURDEGVXC7E8uEB8xUsD2DGz2c',
      attributes: attributes,
    };

    try {
      let url;
      if (typeof nftStorageToken == 'undefined') {
        console.log('Save content using ceramic client');
        const added = await ipfs.add(JSON.stringify(params));
        url = `ipfs://${added.path}`;
      } else {
        //save using NFT.storage
        console.log('Save content using NFT.storage');
        const client = new NFTStorage({ token: nftStorageToken });
        const cid = await client.storeBlob(new Blob([JSON.stringify(params)]));
        url = `ipfs://${cid}`;

        //this is how you see the content in browser
        const metadataUrl = `https://${cid}.ipfs.dweb.link`;
        console.log(`Metadataurl: ${metadataUrl}`);
      }

      setPatientParameters(url);
      console.log(url);
    } catch (err) {
      console.log('Error uploading the file : ', err);
    }

    const ethereum = window.ethereum;
    let provider = new ethers.providers.Web3Provider(window.ethereum);

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    let chainIdString = parseInt(chainId).toString();

    let nftContractAddress = networkMapping[chainIdString].HealthDataNFT[0];

    const signer = provider.getSigner();
    const healthDataNFTContract = new ethers.Contract(
      nftContractAddress,
      healthDataABI,
      signer
    );

    console.log('Mint Token');
    const tx = await healthDataNFTContract.mintNft(
      data.address,
      patientParameters
    );
    await tx.wait(4);
    console.log(`Tx value ${JSON.stringify(tx)}`);

    const tokenId = await healthDataNFTContract.getTokenCounter();
    console.log('Token Id: ' + tokenId);

    const marketplaceAddress =
      networkMapping[chainIdString].HealthNFTMarketplace[0];
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      marketplaceABI,
      signer
    );

    //First approve the NFT to be listed in Marketplace contract
    console.log('Approve to add NFT to Marketplace ', data.address);
    const approvalTx = await healthDataNFTContract.approve(
      marketplaceAddress,
      tokenId
    );
    await approvalTx.wait(2);

    console.log('LIST NFT in marketplace');
    const tx2 = await marketplaceContract.listItem(
      nftContractAddress,
      tokenId, // manually change for debugging
      PRICE
    );
    await tx2.wait(2);
    console.log(`Tx value ${JSON.stringify(tx2)}`);

    updateNotification({
      id: 'load-data-sell-nft',
      color: 'teal',
      title: 'NFT listed.',
      message: 'Your data has been successfully listed on the Marketplace.',
      icon: <Check />,
      autoClose: 3000,
    });
  }

  return (
    <Container size="sm" className={classes.wrapper}>
      <div className={classes.controls} style={{ paddingBottom: '20px' }}>
        <Button className={classes.control} size="lg" onClick={SellNFT}>
          Sell Your Anonymized Data on NFT Marketplace
        </Button>
      </div>
      <Accordion
        iconPosition="right"
        classNames={{
          item: classes.item,
          itemOpened: classes.itemOpened,
          control: classes.control,
        }}
      >
        <Accordion.Item label="Patient basic Information">
          <PatientBasicInformation
            name={name}
            gender={gender}
            date={date}
            maritalStatus={maritalStatus}
          />
        </Accordion.Item>

        <Accordion.Item label="Patient personal Information">
          <PatientPersonalInformation phone={phone} emailAddress={mail} />
        </Accordion.Item>
      </Accordion>

      <PatientMedicalInformation
        allergies={allergies}
        currentMedications={currentMedications}
        symptoms={symptoms}
        progressNotes={progressNotes}
        vitalSigns={vitalSigns}
      />
    </Container>
  );
}
