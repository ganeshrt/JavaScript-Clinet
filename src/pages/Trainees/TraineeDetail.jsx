import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import { Link } from 'react-router-dom';
import { withStyles, Button, Typography } from '@material-ui/core';
import moment from 'moment';
import trainees from './data/trainee';
import { withLoaderAndMessage } from '../../components/HOC/withLoaderAndMessage';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(4),
  },
  profileBlock: {
    backgroundColor: '#2f3640',
    textAlign: 'center',
    display: 'flex',
    color: 'white',
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
});
class TraineeDetail extends React.Component {
  getTraineeDetail = match => trainees.map((item) => {
    const { classes } = this.props;
    if (match.params.id === item.id) {
      return (
        <div>
          <Grid xs="12" className={classes.control}>
            <Paper>
              <Grid container className={classes.root} spacing={4} xs={11}>
                <Grid item xs={2} className={classes.profileBlock} justify="center">
                  <Typography variat="h5">Thumbnail</Typography>
                </Grid>

                <Grid item xs={10}>
                  <Typography><h2>{item.name}</h2></Typography>
                  <FormLabel>
                    {moment(item.createdAt).format('dddd,MMMM Do YYYY, h:mm:ss a')}
                  </FormLabel>
                  <Typography variat="h5">
                    {item.email}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <center>
            <Button size="small" variant="contained"><Link to="/trainee" className={classes.link}> Back</Link></Button>
          </center>
        </div>
      );
    }
    return null;
  });

  render() {
    const { match } = this.props;
    console.log('props in trainee Detail ', this.props);
    return (
      <div>
        <h3>
          {this.getTraineeDetail(match)}
        </h3>
      </div>
    );
  }
}

export default withLoaderAndMessage(withStyles(styles)(TraineeDetail));
