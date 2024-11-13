import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#F5686B', // Updated to match Vanta color
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#801BEC', // Purple shade for contrast
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#1A1A1A', // Dark background to enhance Vanta visibility
            paper: '#2C2C2C',    // Slightly lighter than default for card backgrounds
        },
        text: {
            primary: '#FFFFFF', // White text for readability against dark backgrounds
            secondary: '#F5686B', // Accent color for secondary text
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        h4: {
            fontWeight: 700,
            color: '#FFFFFF',
        },
        h6: {
            fontWeight: 600,
            color: '#F5686B',
        },
        body1: {
            color: '#FFFFFF',
        },
        body2: {
            color: '#F5686B',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    backgroundColor: '#2C2C2C',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'transparent',
                    boxShadow: 'none',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
                },
            },
        },
    },
});

export default theme;
