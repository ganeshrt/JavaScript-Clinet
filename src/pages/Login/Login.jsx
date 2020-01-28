import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import Mail from '@material-ui/icons/Mail';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import * as yup from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { Redirect } from 'react-router-dom';
import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { callAPI } from '../../lib/utils/api';
import { WithSnackBarConsumer } from '../../contexts';
import { withToken } from '../../contexts/HOC/withToken';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: '50px',
  },
  container: {
    maxWidth: '500px',
    boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.5)',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: {},
      touch: {},
      pass: '',
      hasError: true,
      showPass: false,
      loading: false,
      login: false,
      render: false,
      redirectTrainee: false,
    };
  }

  validation = () => {
    const schema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required('Email is required !')
        .matches(/@successive.tech$/),
      pass: yup
        .string()
        .required('Password is required !')
        .min(8, 'Password must be at least 8 characters'),
    });

    const { email, pass } = this.state;
    schema
      .validate({ email, pass }, { abortEarly: false })
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

  onSingIn = async () => {
    const { email, pass } = this.state;
    const { setToken } = this.props;
    // const url = 'https://express-training.herokuapp.com/api/user/login';
    // const data = {
    //   email,
    //   password: pass,
    // };

    this.setState({
      loading: true,
    });
    const QUERY = gql`
    mutation {
      login(email: "${this.state.email}", password: "${this.state.pass}")
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
        setToken(res.data.login);
        this.setState({
          loading: false,
          redirectTrainee: true,
        });

        console.log('token res :', res.data.data);
      })
      .catch((err) => {
        console.log('error :', err);
        this.setState({
          loading: false,
        });
        this.props.handleOpen(' Invalid email or password !', 'error');
      });

    // try {
    //   const res = await callAPI({ url, method: 'post', data });
    //   const data = this.callApolloServer();
    //   console.log('login response =>', data.data);
    //   setToken(res.data.login);
    //   this.setState({
    //     loading: false,
    //     redirectTrainee: true,
    //   });
    // } catch (err) {
    //   this.setState({
    //     loading: false,
    //   });
    //   this.props.handleOpen(' Invalid email or password !', 'error');
    // }
  };

  callApolloServer = () => {
    const QUERY = gql`
      {
        getData(limit: 10, skip: 20) {
          name
          email
          createdAt
        }
      }
    `;

    return (
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          console.log(' data :', data);
          console.log('error :', error);
          console.log(loading);
          return '';
        }}
      </Query>
    );
  };

  render() {
    const { classes } = this.props;
    const {
 email, showPass, hasError, loading, redirectTrainee 
} = this.state;
    return (
      <Container component="main" className={classes.container}>
        <Typography position="center">
          <CssBaseline />
          <div className={classes.paper}>
            <center>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
            </center>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={this.handleChange('email')}
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
                id="email"
                name="email"
                autoComplete="email"
              />
              <TextField
                required
                fullWidth
                name="password"
                id="password"
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
                autoComplete="current-password"
              />

              <Button
                type="button"
                fullWidth
                className={classes.submit}
                variant="contained"
                color="primary"
                onClick={this.onSingIn}
                disabled={hasError || loading}
              >
                Sign In okay
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Button>

              {redirectTrainee ? <Redirect to="/trainee" /> : ''}
            </form>
          </div>
        </Typography>
      </Container>
    );
  }
}

export default withApollo(
  WithSnackBarConsumer(withToken(withStyles(styles)(Login))),
);
