import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper, CircularProgress, Link } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const ResendConfirmation: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/resend-confirmation', { email });
            enqueueSnackbar(response.data || 'Confirmation email sent successfully.', { variant: 'success' });
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            if (err.response) {
                if (err.response.status === 429) {
                    enqueueSnackbar('Too many requests. Please try again later.', { variant: 'error' });
                } else if (err.response.status === 400) {
                    enqueueSnackbar(err.response.data || 'Invalid email or already confirmed.', { variant: 'error' });
                } else {
                    enqueueSnackbar('Error sending confirmation email. Please check your email address.', { variant: 'error' });
                }
            } else {
                enqueueSnackbar('Network error. Please try again.', { variant: 'error' });
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={6} sx={{ padding: 4, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Resend Confirmation Email
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            margin="normal"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Resend Email'}
                        </Button>
                    </form>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Remembered your password?{' '}
                            <Link
                                component={RouterLink}
                                to="/login"
                                underline="hover"
                                color="inherit"
                                sx={{ textDecoration: 'underline' }}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ResendConfirmation;
