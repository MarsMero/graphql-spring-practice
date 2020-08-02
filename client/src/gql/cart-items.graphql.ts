import { gql } from '@apollo/client';

export default gql`
  query cartItems {
    cartItems @client {
      color {
        name
        hexCode
      }
      size
      amount
    }
  }
`;