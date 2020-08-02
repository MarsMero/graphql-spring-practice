import { makeVar } from "@apollo/client";

interface Color {
  hexCode: string;
  name: string;
}

interface CartItem {
  id: string;
  color: Color;
  size: string;
  amount: number;
}

const cartItemsVar = makeVar<CartItem[]>([]);

export const getCartItems = () => {
  return cartItemsVar();
}

export const getCartItem = (hexCode: string, size: string) => {
  const cartItems = getCartItems();
  const id = getIdFor(hexCode, size);
  return cartItems.find(item => item.id === id);
}

export const addToCart = ({color, size} : {color: Color, size: string}) => {
  const hexCode = color.hexCode;
  const id = getIdFor(hexCode, size);
  const name = color.name;
  const cartItems = cartItemsVar();
  let amount = 0;

  const newItems = cartItems.map((oldItem: CartItem) => {
    if (oldItem.id === id) {
      amount = oldItem.amount + 1;
      return {...oldItem, amount};
    } else {
      return oldItem;
    }
  });

  if (amount === 0) {
    const newItem = {
      id,
      color: {
        hexCode,
        name
      },
      size,
      amount: 1
    };
    cartItemsVar([...newItems, newItem])
  } else {
    cartItemsVar(newItems);
  }
}

function getIdFor(hexCode: string, size: string) {
  return hexCode + ':' + size;
}

