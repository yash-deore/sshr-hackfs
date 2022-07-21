import { gql } from '@apollo/client';

const GET_ACTIVE_ITEMS = gql`
  {
    nftissueds(first: 5) {
      id
      nftHolder
      nftAddress
      tokenId
      uri
    }
  }
`;

export default GET_ACTIVE_ITEMS;
