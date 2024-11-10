// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#801BEC', // Updated primary color
        },
        secondary: {
            main: '#FF4081', // Secondary color
        },
        background: {
            default: '#F0F2F5',
            paper: '#FBFBFB',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                },
            },
        },
    },
});

export default theme;
