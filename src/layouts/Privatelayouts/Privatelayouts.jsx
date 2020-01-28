import React from 'react';
import Navbar from '../components/Navbar/Navbar';

export const Privatelayouts = ({ children, ...rest }) => (
  <>
    <Navbar />
    <div className="page page-login">
      <div className="main">
        {children}
      </div>
    </div>
  </>
);
