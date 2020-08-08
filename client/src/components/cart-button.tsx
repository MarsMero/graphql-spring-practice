import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Button } from '@material-ui/core';
import { addToCart } from '../variables/cart';
import { GET_UNITS } from '../gql/units.graphql';

const GET_CART_ITEM = gql`
  query cartItem($hexCode: String!, $size: String!) {
    cartItem(hexCode: $hexCode, size: $size) @client {
      id
      color {
        hexCode
        name
      }
      size
      amount
    }
  }
`;

export const CartButton: React.FC<any> = (props: any) => {
  const {
    hexCode,
    size,
    getColorName
  } = props
  const {data: unitData} = useQuery(GET_UNITS);
  const [disabled, setDisabled] = useState(true);
  const {data: cartData} = useQuery(GET_CART_ITEM, {
    variables: {
      hexCode,
      size,
    }
  });

  useEffect(() => {
    function canAddToCart(): boolean {
      if (!unitData || !hexCode || !size) {
        return false;
      }
      const {stockAmount} = unitData.units.find((x: any) => x.hexCode === hexCode && x.size === size)
      const cartAmount = cartData ? cartData.cartItem.amount : 0;
      return stockAmount > cartAmount;
    }

    setDisabled(!canAddToCart())
  },[unitData, cartData, hexCode, size]);


  const handleClick = () => {
    const color = { hexCode, name: getColorName(hexCode) };
    addToCart({ color, size });
  };
  return (
    <Button onClick={handleClick} variant="contained" color="primary" 
      disabled={disabled}>Add</Button>
  );
}