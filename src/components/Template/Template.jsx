import React from 'react';
import { Typography } from '@material-ui/core';

class Template extends React.Component {
  render() {
    const {
      first, result, second, operator,
    } = this.props;

    const OPERATOR_LIST = {
      '+': 'Sum',
      '-': ' Substraction',
      '*': 'Multiplication',
      '/': 'Division',
    };
    return (
      <Typography variant="h5">
        <div>
          {OPERATOR_LIST[operator]}
          {' '}
          of
          {' '}
          {first}
          {' '}
          and
          {' '}
          {second}
          {`  i.e (${first}${operator}${second}) ` }
          is
          {' '}
          {result}
        </div>
      </Typography>
    );
  }
}
export { Template };
