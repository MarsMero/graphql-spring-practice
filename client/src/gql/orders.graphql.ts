import { gql } from '@apollo/client';

export const ORDER_DATA = gql`
  fragment OrderData on PlacedOrder {
    id
    age
    name
    timestamp
    units {
      amount
      hexCode
      size
    }
  }
`;

export const GET_ORDERS = gql`
  query orders {
    orders {
      ...OrderData
    }
  }
  ${ORDER_DATA}
`;

