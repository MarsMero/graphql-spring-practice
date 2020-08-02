import React, { Fragment } from 'react';
import Cart from './cart';
import { Container } from '@material-ui/core';

export default function Pages() {
  return (
    <Fragment>
      <Container>
        <h1>Hello Pages</h1>
        <Cart/>
      </Container>
    </Fragment>
  );
}