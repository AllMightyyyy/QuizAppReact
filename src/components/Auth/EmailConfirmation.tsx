// src/components/Auth/EmailConfirmation.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, Box, Button } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EmailConfirmation: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            if (token) {
                try {
                    await axiosInstance.post('/api/confirm', { token });
                    setStatus('success');
                    enqueueSnackbar('Email confirmed successfully!', { variant: 'success' });
                    setTimeout(() => navigate('/login'), 3000);
                } catch (err: any) {
                    if (err.response && err.response.data && err.response.data.error) {
                        setErrorMessage(err.response.data.error);
                        enqueueSnackbar(err.response.data.error, { variant: 'error' });
                    } else {
                        setErrorMessage('Invalid or expired token.');
                        enqueueSnackbar('Invalid or expired token.', { variant: 'error' });
                    }
                    setStatus('error');
                }
            } else {
                setErrorMessage('Invalid or expired token.');
                setStatus('error');
                enqueueSnackbar('Invalid or expired token.', { variant: 'error' });
            }
        };
        confirmEmail();
    }, [location, navigate, enqueueSnackbar]);

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 5 }}>
            {status === 'loading' && (
                <Box>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Confirming your email...
                    </Typography>
                </Box>
            )}
            {status === 'success' && (
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Email confirmed successfully!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Redirecting to login page...
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                        Go to Login
                    </Button>
                </Box>
            )}
            {status === 'error' && (
                <Box>
                    <Typography variant="h5" color="error" gutterBottom>
                        {errorMessage}
                    </Typography>
                    <Button component={RouterLink} to="/resend-confirmation" variant="contained" color="primary">
                        Resend Confirmation Email
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default EmailConfirmation;
