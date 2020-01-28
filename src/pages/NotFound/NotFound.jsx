import React from 'react';
import { Typography } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';

export class NotFound extends React.Component {
  render() {
    return (
      <div>
        <center>
          <Typography variant="h2"> Not Found</Typography>
          <Typography variant="h5">
            <FormLabel>seems link the page your looking after does not exist </FormLabel>
          </Typography>
        </center>
      </div>
    );
  }
}
