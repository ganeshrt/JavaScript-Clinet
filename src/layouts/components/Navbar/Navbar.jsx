import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import { withToken } from '../../../contexts/HOC/withToken';


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginButtom: '50px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
});
class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    };
  }

  onLogout = () => {
    const { removeToken } = this.props;
    removeToken();
    this.setState({
      redirect: true,
    });
  };

  render() {
    const { classes } = this.props;
    const { redirect } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
                Trainee Portal
            </Typography>
            <Button color="inherit">
              <Link to="/trainee" color="inherit" className={classes.link}>
                  TRAINEE
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/textfield-demo" className={classes.link}>
                  TEXTFIELD DEMO
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/input-demo" className={classes.link}>
                  INPUT DEMO

              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/children-demo" className={classes.link}>

                  CHILDREN DEMO
              </Link>
            </Button>
            <Button
              type="button"
              color="inherit"
              to="/login"
              onClick={() => { this.onLogout(); }}
            >
                LOGOUT
            </Button>
            {
              redirect ? <Redirect to="/login" /> : ''
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withToken(withStyles(styles)(Navbar));
