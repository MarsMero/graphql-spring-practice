import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation, DataProxy, FetchResult } from '@apollo/client';
import { Button } from '@material-ui/core';
import GET_CART_ITEMS from '../gql/cart.graphql';
import { GET_ORDERS, ORDER_DATA } from '../gql/orders.graphql';
import { clearCart } from '../variables/cart';

const PLACE_ORDER = gql`
  mutation placeOrder($age: Int!, $name: String!, $units: [OrderUnitInput]) {
    placeOrder(params: {
      age: $age
      name: $name
      units: $units
    }) {
      ...OrderData
    }
  }
  ${ORDER_DATA}
`;

const usePlaceOrderMutation = () => {
  return useMutation(PLACE_ORDER, {
    refetchQueries: [
      { query: GET_ORDERS }
    ]
  });
}

export const OrderButton: React.FC<any> = (props: any) => {
  const {
    name,
    age,
    valid
  } = props;
  const [disabled, setDisabled] = useState(true);
  const {
    data
  } = useQuery(GET_CART_ITEMS);
  const [mutate] = usePlaceOrderMutation();

  useEffect(() => {
    function canOrder(): boolean {
      return data.cartItems.length > 0;
    }
    setDisabled(!canOrder());
  }, [data]);

  const handleClick = () => {
    if (!valid) return props.onClick?.();
    setDisabled(true);
    const units = data.cartItems.map((x: any) => ({
      amount: x.amount,
      size: x.size,
      hexCode: x.color.hexCode
    }))
    const numAge = parseInt(age);
    mutate({
      variables: {
        age: numAge,
        name,
        units
      }
    });
    clearCart();
    props.onSubmit?.();
  }
  return (
    <Button onClick={handleClick} variant="contained" color="primary" 
      disabled={disabled}>Order</Button>
  );
}