// src/components/Auth/Register.tsx
import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Link, Paper, CircularProgress, InputAdornment } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import {AuthContext} from "../../context/AuthContext";

const Register: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to main page if logged in
        }
    }, [isAuthenticated, navigate]);

    const formik = useFormik({
        initialValues: { username: '', email: '', password: '' },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .required('Username is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: async (values, { setErrors }) => {
            setLoading(true);
            try {
                await axiosInstance.post('/api/auth/register', values);
                enqueueSnackbar('Registration successful! Please check your email to confirm.', { variant: 'success' });
                setLoading(false);
                navigate('/check-email');
            } catch (err: any) {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.errors) {
                    setErrors(err.response.data.errors);
                    enqueueSnackbar('Registration failed. Please check your inputs.', { variant: 'error' });
                } else {
                    setErrors({ username: 'Registration failed. Please try again.' });
                    enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
                }
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                <Paper elevation={6} sx={{ padding: 4, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Register
                    </Typography>
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
                            label="Email"
                            name="email"
                            type="email"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
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
                                        {/* Implement password visibility toggle if desired */}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    </form>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" underline="hover">
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
