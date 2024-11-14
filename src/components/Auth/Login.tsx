// src/components/Auth/Login.tsx
import React, { useEffect, useContext, useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link, Paper, CircularProgress, Checkbox, FormControlLabel, InputAdornment, IconButton } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { login, isAuthenticated } = useContext(AuthContext);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to main page if logged in
        }
    }, [isAuthenticated, navigate]);

    const formik = useFormik({
        initialValues: { username: '', password: '' },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values, { setErrors }) => {
            setLoading(true);
            try {
                const response = await axiosInstance.post('/api/auth/login', values);
                const token = response.data.token;
                login(token, rememberMe);
                enqueueSnackbar('Login successful!', { variant: 'success' });
                navigate('/');
            } catch (err: any) {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.error) {
                    const errorMessage = err.response.data.error;
                    setError(errorMessage);
                    enqueueSnackbar(errorMessage, { variant: 'error' });
                } else {
                    setError('Login failed. Please check your credentials.');
                    enqueueSnackbar('Login failed. Please check your credentials.', { variant: 'error' });
                }
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={6} sx={{ padding: 4, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Login
                    </Typography>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={handleRememberMeChange}
                                    color="primary"
                                />
                            }
                            label="Remember Me"
                            sx={{ mt: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Link component={RouterLink} to="/register" underline="hover">
                                Register here
                            </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Didn't receive a confirmation email?{' '}
                            <Link component={RouterLink} to="/resend-confirmation" underline="hover">
                                Resend Confirmation Email
                            </Link>
                        </Typography>
                        {error && (
                            <Typography color="error" align="center" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
