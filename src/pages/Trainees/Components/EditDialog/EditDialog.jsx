import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Mail from '@material-ui/icons/Mail';
import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import CircularProgress from '@material-ui/core/CircularProgress';
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
});

class EditDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      id: '',
      error: {},
      touch: {},
      ConfirmPass: '',
      hasError: true,
      showPass: false,
      showConfirmPass: false,
      loading: false,
    };
    this.setState({
      name: props.name,
    });
  }

  validation = () => {
    console.log('validator :');
    const schema = yup.object().shape({
      name: yup
        .string()
        .required(' Name is required !')
        .min(3),
      email: yup
        .string()
        .email()
        .required('Email is required !')
        .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/),
    });

    const { email, name } = this.state;
    schema
      .validate(
        {
          name,
          email,
        },
        { abortEarly: false },
      )
      .then((res) => {
        if (res) {
          this.setState({
            hasError: false,
            error: {},
          });
        }
      })
      .catch((err) => {
        console.log(' error path  :', err);
        const parsedError = [];
        err.inner.map((item) => {
          if (!parsedError[item.path]) {
            parsedError[item.path] = item.message;
          }
          return null;
        });

        this.setState({
          hasError: true,
          error: parsedError,
        });
      });
  };

  hasErrors = (value) => {
    const { error } = this.state;
    if (error[value]) {
      return true;
    }
    return false;
  };

  isTouched = (value) => {
    const { touch } = this.state;
    if (touch[value]) {
      return true;
    }
    return false;
  };

  getErrors = (value) => {
    if (this.isTouched(value) && this.hasErrors(value)) {
      return true;
    }
    return false;
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.value }, this.validation);
  };

  handleBlur = field => () => {
    const { touch } = this.state;
    touch[field] = true;
    console.log('on blur', field, touch);
    this.setState(
      {
        touch,
      },
      this.validation,
    );
  };

  displayError = (field) => {
    const { error } = this.state;
    if (this.isTouched(field) && this.hasErrors(field)) {
      return error[field];
    }
  };

  handleClickShowPassword = () => {
    const { showPass } = this.state;
    this.setState({ showPass: !showPass });
  };

  handleClickShowConfirmPassword = () => {
    const { showConfirmPass } = this.state;
    this.setState({ showConfirmPass: !showConfirmPass });
  };

  confirmPassword() {
    const { pass, confirmPass } = this.state;
    if (confirmPass !== pass) {
      return 'Must match password';
    }
    return null;
  }

  ComponentDidMount = () => {
    this.setState({
      id: this.props.id,
    });
  };

  onSubmitHandler = () => async () => {
    const { email, name } = this.state;
    const url = 'https://express-training.herokuapp.com/api/trainee';
    const data = {
      id: this.props.id.originalId,
      name,
      email,
    };
    this.setState(
      {
        loading: true,
      },
      this.props.onClose(),
    );
    // try {
    //   const res = await callAPI({
    //     url,
    //     method: 'put',
    //     data,
    //   });
    //   console.log('res : ', res);
    //   this.props.handleOpen('Data updated successfully !', 'success');
    //   this.setState({
    //     loading: false,
    //     redirectTrainee: true,
    //   });
    // } catch (err) {
    //   this.setState({
    //     loading: false,
    //   });

    //   this.props.handleOpen(' Server down !', 'error');
    // }
    // };

    const QUERY = gql`
    mutation {
      updateUser(Id:"${this.props.id.originalId}",name :"${
      this.state.name
    }",email: "${this.state.email}")
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
        console.log('mutation Updated user res :', res);
        this.setState({
          loading: false,
          redirectTrainee: true,
        });
        this.props.handleOpen(res.data.updateUser, 'success');
      })
      .catch((err) => {
        console.log('error :', err);
        this.setState({
          loading: false,
        });
        this.props.handleOpen(' Someting went to wrong..!', 'error');
      });
  };

  render() {
    const {
 open, onClose, classes, id 
} = this.props;
    const { hasError, loading } = this.state;

    console.log('id :', this.props.id.originalId);
    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Trainee </DialogTitle>
          <DialogContent>
            <DialogContentText>update trainee detail :</DialogContentText>
            <form className={classes.container} noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-name"
                    label="Name"
                    className={classes.textField}
                    defaultValue={id.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    onBlur={this.handleBlur('name')}
                    variant="outlined"
                    error={this.getErrors('name')}
                    helperText={this.displayError('name')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="outlined-name"
                    className={classes.textField}
                    defaultValue={id.email}
                    onChange={this.handleChange('email')}
                    margin="normal"
                    variant="outlined"
                    label="Email Address"
                    onBlur={this.handleBlur('email')}
                    type="email"
                    error={this.getErrors('email')}
                    helperText={this.displayError('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.onSubmitHandler()}
              color="primary"
              variant="contained"
              disabled={hasError}
            >
              Submit
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

export default withApollo(WithSnackBarConsumer(withStyles(styles)(EditDialog)));
