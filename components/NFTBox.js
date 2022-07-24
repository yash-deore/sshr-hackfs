import { useState, useEffect } from 'react';
import nftABI from '../constants/HealthDataNFT.json';
import marketplaceABI from '../constants/HealthNFTMarketplace.json';
import networkMapping from '../constants/networkMapping.json';

// import Image from "next/image";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  createStyles,
  useMantineTheme,
  SimpleGrid,
  Popover,
  Title,
} from '@mantine/core';
import { ethers } from 'ethers';
import { PatientMedicalInformation } from './patient-medical-information';

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

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  seller,
  provider,
  account,
  marketplaceAddress,
}) {
  const { classes } = useStyles();
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [healthData, setHealthData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);
  const [paidFlag, setPaidFlag] = useState(false);
  const [nfts, setNfts] = useState([]);

  const [opened, setOpened] = useState(false);
  //const [loadingState, setLoadingState] = useState('not-loaded');
  //const [chainId, setChainId] = useState('');
  console.log('Params:', nftAddress, tokenId, price);

  async function getTokenURI() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftAddress, nftABI, signer);

    const tokenURI = await nftContract.getTokenURI(tokenId);
    return tokenURI;
  }

  async function buyItem() {
    console.log('Bought item');
    setPaidFlag(!paidFlag);
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
        } else {
          setImageURI(
            'https://avatars.githubusercontent.com/u/109106474?s=200&v=4'
          );
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
    <>
      <SimpleGrid cols={2}>
        <div>
          <div>
            {
              <div>
                <Card
                  title={tokenName}
                  description={tokenDescription}
                  className={classes.card}
                  withBorder
                  radius="md"
                  p="md"
                >
                  <Card.Section className={classes.section} mt="md">
                    <Group position="apart">
                      <Text size="lg" weight={500}>
                        ID: {tokenId} {healthData.gender} , {healthData.date}
                      </Text>
                    </Group>
                    <Text size="sm" mt="xs">
                      Owned by {formattedSellerAddress}
                    </Text>
                  </Card.Section>

                  <Card.Section>
                    <Image src={imageURI} alt={tokenId} height={200} />
                  </Card.Section>

                  <Group mt="xs">
                    {isOwnedByUser ? (
                      <></>
                    ) : (
                      // <Button
                      //   onClick={handleCardClick}
                      //   radius="md"
                      //   style={{ flex: 1 }}
                      // >
                      //   Buy Data
                      // </Button>

                      <Popover
                        opened={opened}
                        onClose={() => setOpened(false)}
                        target={
                          <Button
                            radius="md"
                            style={{ flex: 1 }}
                            onClick={() => setOpened((o) => !o)}
                          >
                            Buy Patient Data
                          </Button>
                        }
                        // width={260}
                        position="right"
                        withArrow
                      >
                        <PatientMedicalInformation
                          allergies={healthData.allergies}
                          currentMedications={healthData.currentMedications}
                          symptoms={healthData.symptoms}
                          progressNotes=""
                          vitalSigns={healthData.vitalSigns}
                        />
                      </Popover>
                    )}
                  </Group>
                </Card>
                <br />
              </div>
            }
          </div>
        </div>
      </SimpleGrid>
    </>
  );
}
