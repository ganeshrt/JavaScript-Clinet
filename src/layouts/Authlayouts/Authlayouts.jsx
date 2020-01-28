import React from 'react';
import { Footer } from '../components/Footer';

export const Authlayouts = ({ children, ...rest }) => (
  <div className="page page-login">
    <div className="main">
      {children}
    </div>
    <Footer />
  </div>
);
