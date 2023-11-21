import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  components: {
    // Apply global style overrides here
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
        },
      },
    },
    // Add other component overrides as needed
  },
});

export default theme;
