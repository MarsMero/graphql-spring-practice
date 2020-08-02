import { ApolloCache, Resolvers, gql, useQuery, makeVar } from '@apollo/client';
import GET_CART_ITEMS from './gql/cart-items.graphql';

export const typeDefs = gql`
  extend type Query {
    cartItems: [CartItem!]!
    sizes: [String!]!
    cartItem(hexCode: String!, size: Int!): CartItem!
  }

  type CartItem {
    color: Color!
    size: String!
    amount: Int!
  }

  extend type Mutation {
    addToCart(color: Color!, size: String!): Int!
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Query: ResolverMap;
  Mutation: ResolverMap;
}

export const resolvers: AppResolvers = {
  Query: {
    cartItem: (_, {hexCode, size} : {hexCode: string, size: string}, {cache}): any => {
      const {cartItems} = cache.readQuery({query: GET_CART_ITEMS}) as any;
      return cartItems.find((x: any) => x.color.hexCode === hexCode && x.size === size);
    }
  },
  Mutation: {
    addToCart: (_, {color, size} : {color : any, size: String}, {cache}): number => {
      const result = cache.readQuery({query: GET_CART_ITEMS});
      let newItems = [];
      let amount = 0;
      if (result) {
        const { cartItems } = result as any;
        newItems = cartItems.map((x: any) => {
          if (x.color.hexCode === color.hexCode && x.size === size) {
            amount = x.amount + 1;
            return {...x, amount};
          } else {
            return x;
          }
        })
      }
      if (amount === 0) {
        amount = 1;
        newItems.push({color, size, amount})
      }
      cache.writeQuery({query: GET_CART_ITEMS, data: {
        cartItems: newItems
      }});
      return amount;
    }
  }
};