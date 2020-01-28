import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { WithSnackBarConsumer } from '../../../../contexts';
import { callAPI } from '../../../../lib/utils/api';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexGrow: '1',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 400,
  },

  passField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flex: '1',
    width: '100%',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

class RemoveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      id: '',
      date: '',
      loading: false,
    };
  }

  onDeleteHandler = async () => {
    if (
      !moment(this.props.id.createdAt).isAfter(
        moment('2019-02-14T18:15:11.778Z'),
      )
    ) {
      this.props.handleOpen(" Can't delete the data !", 'error');
    } else {
      const url = 'https://express-training.herokuapp.com/api/trainee/';
      const params = {
        id: this.props.id.originalId,
      };
      this.setState({
        loading: true,
      });
      // try {
      //   const res = await callAPI({
      //     url: url + this.props.id.originalId,
      //     method: 'delete',
      //     params,
      //   });
      //   console.log('res : ', res);
      //   this.props.handleOpen('Data Deleted successfully !', 'success');
      //   this.setState({
      //     loading: false,
      //     redirectTrainee: true,
      //   });
      // } catch (err) {
      //   this.setState({
      //     loading: false,
      //   });

      //   this.props.handleOpen("Can't delete data", 'error');
      // }

      const QUERY = gql`

      mutation{
        deleteUser(Id:"${this.props.id.originalId}")
      }

  `;

      this.props.client
        .mutate({
          mutation: QUERY,
          variables: {
            limit: 100,
            skip: 0,
          },
        })
        .then((res) => {
          console.log('mutation delete user res :', res);
          this.setState({
            loading: false,
            redirectTrainee: true,
          });
          this.props.handleOpen(res.data.deleteUser, 'success');
        })
        .catch((err) => {
          console.log('error :', err);
          this.setState({
            loading: false,
          });
          this.props.handleOpen(' Someting went to wrong..!', 'error');
        });
    }

    this.props.onClose();
  };

  render() {
    const {
 open, onClose, loading, classes 
} = this.props;
    console.log('state item :', this.props);

    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Remove Trainee</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid container>
                <Grid item xs={12}>
                  Do youn really want to remove the trainee ?
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.onDeleteHandler}
              color="primary"
              variant="contained"
            >
              Delete
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withApollo(
  WithSnackBarConsumer(withStyles(styles)(RemoveDialog)),
);
