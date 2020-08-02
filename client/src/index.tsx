import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import {
  ApolloClient, InMemoryCache, NormalizedCacheObject,
  HttpLink, ApolloProvider, gql
} from '@apollo/client';

import CssBaseline from '@material-ui/core/CssBaseline';

import Pages from './pages/main';
import { typeDefs, resolvers } from './resolvers';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:8080/graphql'
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers
});

cache.writeQuery({
  query: gql`
    query {
      cartItems @client
      sizes @client
    }
  `,
  data: {
    cartItems: [],
    sizes: ['S','M','L','XL']
  }
});

ReactDOM.render(
  <Fragment>
    <CssBaseline/>
    <ApolloProvider client={client}>
      <Pages />
    </ApolloProvider>
  </Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
