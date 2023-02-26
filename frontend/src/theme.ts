import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    myCustomColor: PaletteColor;
  }
  interface PaletteOptions {
    myCustomColor?: PaletteColorOptions;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E2E2E',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2E2E2E'
    },
    myCustomColor: {
      main: '#abcdef',
    },
  },
});

export default theme;