import { createTheme } from '@mui/material/styles';

const spaceCadet = '#22223b';
const independence = '#4a4e69';
const heliotropeGray = '#9a8c98';
const silverPink = '#c9ada7';
const Isabelline = '#f2e9e4';

export default createTheme({
  palette: {
    text: {
      primary: `${spaceCadet}`,
      secondary: `${independence}`,
    },
    common: {
      grey: `${heliotropeGray}`,
    },
    primary: {
      main: `${independence}`,
      contrastText: `${Isabelline}`,
    },
    secondary: {
      main: `${silverPink}`,
    },
    background: {
      main: `${Isabelline}`,
      contrastText: `${spaceCadet}`,
    },
  },
});
