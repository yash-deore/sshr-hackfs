import { gql } from '@apollo/client';

// const GET_ACTIVE_ITEMS = gql`
//   {
//     nftissueds(first: 5) {
//       id
//       nftHolder
//       nftAddress
//       tokenId
//       uri
//     }
//   }
// `;

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(first: 50, orderBy: tokenId) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default GET_ACTIVE_ITEMS;
