import React from 'react';
import {
  Route, Redirect,
} from 'react-router-dom';
import { Privatelayouts } from '../layouts/Privatelayouts';
import { withToken } from '../contexts/HOC/withToken';

const PrivateRoute = ({ component: Component, token, ...rest }) => (
  token ? (
    <Route
      {...rest}
      render={matchProps => (
        <>
          <Privatelayouts>
            <Component {...matchProps} />
          </Privatelayouts>
        </>
      )}
    />
  ) : (
    <Redirect to="/login" />
  )
);

export default withToken(PrivateRoute);
