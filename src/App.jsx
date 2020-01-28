import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import axios from 'axios';
import { ApolloProvider } from 'react-apollo';
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { gql } from 'apollo-boost';

import { split, ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { chainResolvers } from 'graphql-tools';
import { theme } from './theme';
import { Trainee } from './pages/Trainees';
import PrivateRoute from './routes/Privateroute';
import Login from './pages/Login/Login';
import { ChildrenDemo } from './pages/ChildrenDemo';
import { InputDemo } from './pages/InputDemo';
import AuthRoute from './routes/Authroute';
import { TextFieldDemo } from './pages/TextFieldDemo';
import { NotFound } from './pages/NotFound';
import { SanckBarProvider } from './contexts/SanckBarProvider';

axios.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization: localStorage.getItem('token'),
    };

    return config;
  },
  error => Promise.reject(error),
);
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    // uri: 'http://localhost:4000',
    headers: {
      ...headers,
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNmQ2NTNiYTA4YzE5MDA1MjM1ZWE1MiIsImlhdCI6MTU2MDc0NTQzNn0.8cdgvP-FlYkK654xENFq9Z2tHvj5kdUYVqD7STFsO_0',
    },
  };
});
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: localStorage.getItem('token'),
    },
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

const defaultState = {
  getData: {
    __typename: 'getData',
    name: 'abc',
    email: 'abc@gmail.com',
    originalId: '123',
    createdAt: '',
  },
};

console.log('link : ', link);
const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: defaultState,
});

const client = new ApolloClient({
  link: ApolloLink.from([stateLink, authLink, httpLink]),
  cache,
  resolvers: {
    Query: {
      getName: (_root, variables, { cache, getCacheKey }) => {
        const id = getCacheKey({ __typename: 'getData', id: variables.id });
        const fragment = gql`
          {
            getData {
              name
              email
              originalId
            }
          }
        `;
        const todo = cache.readFragment({ fragment, id });
        const data = { ...todo };
        cache.writeData({ id, data });

        // cache.writeData({
        //   data: {
        //     getData: {
        //       name: ' ganesh',
        //       email: 'ganesh@gmail.com',
        //       __typename: 'getData',
        //     },
        //   },
        // });
        console.log('getname :', cache);
        return [
          {
            name: 'abc ',
            email: 'abc@gmail.com',
            originalId: '123',
            createdAt: '',
          },
        ];
      },
    },
  },
  typeDefs: `{
    type User {
      name
      email
      originalId
      createdAt
    }
    type Query {
      getName : [User!]!
    }
  }`,
});
export const App = () => (
  <ApolloProvider client={client}>
    <SanckBarProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <AuthRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/trainee" component={Trainee} />
            <PrivateRoute
              exact
              path="/children-demo"
              component={ChildrenDemo}
            />
            <PrivateRoute exact path="/input-demo" component={InputDemo} />
            <PrivateRoute path="/textfield-demo" component={TextFieldDemo} />
            <PrivateRoute component={NotFound} />
          </Switch>
        </Router>
      </ThemeProvider>
    </SanckBarProvider>
  </ApolloProvider>
);
