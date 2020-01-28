import React from 'react';
import { SnackBarContext } from '../SanckBarProvider';

export const WithSnackBarConsumer = (WrappedComponent) => {
  console.log(' WithSanck bar');
  const WrapSnackBarConsumer = props => (
    <SnackBarContext.Consumer>
      {({
        show, displayText, handleOpen, handleClose,
      }) => {
        const snackBarProps = {
          show, displayText, handleOpen, handleClose,
        };
        return <WrappedComponent {...props} {...snackBarProps} />;
      }}
    </SnackBarContext.Consumer>
  );
  return WrapSnackBarConsumer;
};
