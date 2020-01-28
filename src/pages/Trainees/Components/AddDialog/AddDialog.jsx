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
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { WithSnackBarConsumer } from '../../../../contexts';
import { callAPI } from '../../../../lib/utils/api';
import { withToken } from '../../../../contexts/HOC/withToken';

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
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    // marginTop: -40,
    // marginLeft: -12,
  },
});

class AddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      error: {},
      touch: {},
      email: '',
      pass: '',
      ConfirmPass: '',
      hasError: true,
      showPass: false,
      showConfirmPass: false,
      openSuccess: false,
      closeSuccess: false,
      loading: false,
    };
  }

  validation = () => {
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
      pass: yup
        .string()
        .required('Password is required !')
        .min(8, 'Password must be at least 8 characters'),
      confirmPass: yup
        .string()
        .required(' Confirm password is required !')
        .min(8, ' Confirm password must be at least 8 characters'),
    });

    const {
 email, name, pass, confirmPass 
} = this.state;
    schema
      .validate(
        {
          name,
          email,
          pass,
          confirmPass,
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

  onSubmitHandler = async () => {
    const { email, pass, name } = this.state;
    const url = 'https://express-training.herokuapp.com/api/trainee';
    const data = {
      email,
      password: pass,
      name,
    };
    this.setState({
      loading: true,
    });
    // try {
    //   const res = await callAPI({
    //     url,
    //     method: 'post',
    //     data,

    //   });
    //   console.log('res : ', res);
    //   this.props.handleOpen('Data inserted successfully !', 'success');
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

    // <------with Apollo client ------->
    const QUERY = gql`
    mutation {
      createUser(name :"${this.state.name}",email: "${
      this.state.email
    }", password: "${this.state.pass}")
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
        console.log('mutation res :', res);
        this.setState({
          loading: false,
          redirectTrainee: true,
        });
        this.props.handleOpen(res.data.createUser, 'success');
        console.log('token res :', res.data.data);
      })
      .catch((err) => {
        console.log('error :', err);
        this.setState({
          loading: false,
        });
        this.props.handleOpen(' Someting went to wrong..!', 'error');
      });
  };

  confirmPassword() {
    const { pass, confirmPass } = this.state;
    if (confirmPass !== pass) {
      return 'Must match password';
    }
    return null;
  }

  render() {
    const {
      name,
      email,
      pass,
      confirmPass,
      showPass,
      showConfirmPass,
      hasError,
      loading,
    } = this.state;
    const { open, onClose, classes } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Trainee</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Your trainee detail :</DialogContentText>

            <form className={classes.container} noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-name"
                    label="Name"
                    className={classes.textField}
                    value={name}
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
                    value={email}
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

                <Grid item xs={6}>
                  <TextField
                    id="outlined-name"
                    className={classes.passField}
                    value={pass}
                    onChange={this.handleChange('pass')}
                    margin="normal"
                    variant="outlined"
                    label="Password"
                    type={showPass ? 'text' : 'password'}
                    onBlur={this.handleBlur('pass')}
                    error={this.getErrors('pass')}
                    helperText={this.displayError('pass')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            edge="end"
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {showPass ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="outlined-name"
                    className={classes.passField}
                    value={confirmPass}
                    onChange={this.handleChange('confirmPass')}
                    margin="normal"
                    variant="outlined"
                    label="Confirm password"
                    type={showConfirmPass ? 'text' : 'password'}
                    onBlur={this.handleBlur('confirmPass')}
                    error={this.getErrors('confirmPass')}
                    helperText={
                      this.displayError('confirmPass') || this.confirmPassword
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            edge="end"
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowConfirmPassword}
                          >
                            {showConfirmPass ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
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
              onClick={this.onSubmitHandler}
              variant="contained"
              color="primary"
              disabled={hasError || loading}
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

export default withApollo(
  WithSnackBarConsumer(withToken(withStyles(styles)(AddDialog))),
);
