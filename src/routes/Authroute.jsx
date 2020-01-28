import React from 'react';
import {
  Route, Redirect,
} from 'react-router-dom';
import { Authlayouts } from '../layouts/Authlayouts';
import { withToken } from '../contexts/HOC/withToken';

const AuthRoute = ({ component: Component, token, ...rest }) => (
  !token ? (
    <Route
      {...rest}
      render={matchProps => (
        <Authlayouts>
          <Component {...matchProps} />
        </Authlayouts>
      )}
    />
  ) : (
    <Redirect to="/trainee" />
  )
);

export default withToken(AuthRoute);
