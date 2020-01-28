import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/styles';
import { amber, green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import clsx from 'clsx';


const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: '#e74c3c',
  },
  info: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
    margin: '1px',
  },
  iconVariant: {
    opacity: 0.9,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    padding: '1px',
  },
  variantIcon: {
    success: 'CheckCircleIcon',
    warning: 'WarningIcon',
    error: 'ErrorIcon',
    info: 'InfoIcon',
  },
});

export const SnackBarContext = React.createContext();
class SanckBarProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      handleClose: '',
      message: '',
      status: '',
    };
  }


  closeSnackBar = () => {
    this.setState({
      open: false,
      message: '',
      status: '',
    });
  }


  openSnackBar = (message, status) => {
    this.setState({
      open: true,
      message,
      status,
    });
  }

  render() {
    const {
      classes, children, handleClose,
    } = this.props;
    const variantIcon = {
      success: CheckCircleIcon,
      warning: WarningIcon,
      error: ErrorIcon,
      info: InfoIcon,
    };


    const { open, status } = this.state;
    const Icon = variantIcon[status];

    const style = classes[status];
    return (
      <SnackBarContext.Provider value={
        {
          ...this.state,
          handleOpen: this.openSnackBar,
          handleClose: this.closeSnackBar,
        }
      }
      >
        {children}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
            className: style,
          }}
          message={(
            <span id="message-id" className={style + classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {this.state.message}
            </span>
          )}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={style}
              onClick={this.closeSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </SnackBarContext.Provider>
    );
  }
}


export default withStyles(styles)(SanckBarProvider);
