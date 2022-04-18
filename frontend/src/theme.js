import { createTheme } from '@mui/material/styles';

const richBlack = '#051014';
const jet = '#2E2F2F';
const graniteGray = '#646969';
const lightGrey = '#CBD5D5';
const gainsboro = '#D9E4E4';
const cultured = '#EAF1F1';
const lightCultured = '#F4F9F9';
const red = '#F33';

export default createTheme({
  palette: {
    text: {
      primary: `${richBlack}`,
      secondary: `${graniteGray}`,
    },
    common: {
      black: `${richBlack}`,
      darkGrey: `${jet}`,
      grey: `${lightGrey}`,
      lightGrey: `${gainsboro}`,
      plain: `${cultured}`,
      white: `${lightCultured}`,
      highlight: `${graniteGray}`,
      red: `${red}`,
    },
    primary: {
      main: `${jet}`,
      contrastText: `${cultured}`,
    },
    secondary: {
      main: `${cultured}`,
      contrastText: `${richBlack}`,
    },
    tertiary: {
      main: `${gainsboro}`,
      contrastText: `${richBlack}`,
    },
    select: {
      main: `${graniteGray}`,
      contrastText: `${cultured}`,
    },
    highlight: {
      main: `${red}`,
      contrastText: `${richBlack}`,
    },
    hover: {
      main: `${lightGrey}`,
      contrastText: `${richBlack}`,
    },
  },
});
