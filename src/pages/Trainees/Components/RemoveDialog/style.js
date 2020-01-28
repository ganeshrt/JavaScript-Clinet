import { makeStyles } from '@material-ui/core/styles';


export const useStyles = makeStyles(theme => ({
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
}));
