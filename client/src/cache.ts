import { makeVar, InMemoryCache } from "@apollo/client";
import { getCartItems, getCartItem } from './variables/cart';

const sizesVar = makeVar(['S','M','L', 'XL']);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        sizes: {
          read() {
            return sizesVar();
          }
        },
        cartItems: {
          read() {
            return getCartItems();
          }
        },
        cartItem: {
          read(_: any, {args} : {args: any}) {
            return getCartItem(args.hexCode, args.size);
          }
        }
      }
    }
  }
});