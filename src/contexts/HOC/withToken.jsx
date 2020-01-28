import React, { Component } from 'react';
import { throws } from 'assert';

export const withToken = (WrappedComponent) => {
  class InnerComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        token: localStorage.getItem('token') || '',
      };
    }

    setToken = (token) => {
      if (typeof token === 'string') {
        localStorage.setItem('token', token);
        this.setState({
          token,
        });
      } else {
        throw new Error('Token invalid !');
      }
    };

    getToken = () => localStorage.getItem('token');

    removeToken = () => {
      localStorage.removeItem('token');
    };

    render() {
      const { token } = this.state;
      return (
        <WrappedComponent
          {...this.props}
          token={token}
          setToken={this.setToken}
          removeToken={this.removeToken}
          getToken={this.getToken}
        />
      );
    }
  }
  return InnerComponent;
};
