import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme(
  {
    typography: {
      fontFamily: [
        'Comic Sans MS', 'cursive', 'sans-serif'].join(','),
      fontSize: 12,
    },
  },
);


export const innerTheme = createMuiTheme(
  {
    typography: {
      fontFamily: [
        '"Open Sans"', 'sans-serif'].join(','),
    },
  },
);
