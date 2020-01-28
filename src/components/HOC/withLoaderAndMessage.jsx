import React from 'react';

export const withLoaderAndMessage = (WrappedComponent) => {
  console.log(' withLoaderAndMessage');
  const WrapTable = (props) => {
    // const { data, loading } = props;
    console.log('hoc props :', props);

    const { data } = props;

    return <WrappedComponent {...props} data={data} />;
  };
  return WrapTable;
};
