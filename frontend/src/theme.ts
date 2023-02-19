import { createTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    myCustomColor: PaletteColor;
  }
  interface PaletteOptions {
    myCustomColor?: PaletteColorOptions;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E2E2E',
    },
    secondary: {
      main: '#d32f2f',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    myCustomColor: {
      main: '#abcdef',
    },
  },
});

export default theme;