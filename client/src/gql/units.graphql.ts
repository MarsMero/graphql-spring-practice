import { gql } from '@apollo/client';

export const GET_UNITS = gql`
  query units {
    units {
      hexCode
      size
      stockAmount
    }
  }
`;