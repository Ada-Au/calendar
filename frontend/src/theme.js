import { createTheme } from '@mui/material/styles';

const richBlack = '#051014';
const graniteGray = '#646969';
const glossyGrape = '#9E92AD';
const lavenderWeb = '#E2DEE8';
const lightGrey = '#D4D5DE';
const gainsboro = '#D9E4E4';
const cultured = '#EAF1F1';

export default createTheme({
  palette: {
    text: {
      primary: `${richBlack}`,
      secondary: `${graniteGray}`,
    },
    common: {
      black: `${richBlack}`,
      darkGrey: `${graniteGray}`,
      grey: `${lightGrey}`,
      lightGrey: `${gainsboro}`,
      white: `${cultured}`,
      highlight: `${glossyGrape}`,
    },
    primary: {
      main: `${cultured}`,
      contrastText: `${richBlack}`,
    },
    secondary: {
      main: `${gainsboro}`,
      contrastText: `${richBlack}`,
    },
    select: {
      main: `${glossyGrape}`,
      contrastText: `${cultured}`,
    },
    highlight: {
      main: `${richBlack}`,
      contrastText: `${cultured}`,
    },
    hover: {
      main: `${lavenderWeb}`,
      contrastText: `${richBlack}`,
    },
  },
});
