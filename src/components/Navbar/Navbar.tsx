// src/components/Navbar/Navbar.tsx
import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Dialog, DialogContent, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { startAttempt } from '../../services/attemptService';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
    onSelectQuiz: (quizId: number, attemptId: number) => void;
}

interface Quiz {
    id: number;
    subject: string;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'transparent',
    boxShadow: 'none',
    height: '114px',
    justifyContent: 'center',
    zIndex: 1000,
}));

const LogoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#2C2C2C',
    borderRadius: '10px',
    border: '2px solid #F5686B',
    marginRight: '16px',
    flexGrow: 0,
});

const QuizCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: '200px',
    borderRadius: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.palette.common.white,
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transform: 'scale(1.05)',
    },
    transition: 'transform 0.3s, box-shadow 0.3s',
}));

const Navbar: React.FC<NavbarProps> = ({ onSelectQuiz }) => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchQuizzes();
        }
    }, [isAuthenticated]);

    const fetchQuizzes = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get<Quiz[]>('/api/quizzes');
            setQuizzes(response.data);
        } catch (err: any) {
            setError('Failed to load quizzes. Please try again later.');
            enqueueSnackbar('Failed to load quizzes.', { variant: 'error' });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleQuizSelect = async (quizId: number) => {
        setError('');
        try {
            const attemptResponse = await startAttempt(quizId);
            enqueueSnackbar('Quiz started successfully!', { variant: 'success' });
            onSelectQuiz(quizId, attemptResponse.attemptId); // Pass both quizId and attemptId
            handleDialogClose();
        } catch (err: any) {
            setError('Failed to start the quiz. Please try again.');
            enqueueSnackbar('Failed to start the quiz.', { variant: 'error' });
            console.error(err);
        }
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        setLogoutDialogOpen(false);
        enqueueSnackbar('Logged out successfully.', { variant: 'info' });
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    return (
        <>
            <StyledAppBar position="static">
                <Toolbar sx={{ minHeight: '114px', px: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LogoContainer>
                            <QuizIcon sx={{ color: '#F5686B', fontSize: '2rem' }} />
                        </LogoContainer>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            Quiz App
                        </Typography>
                    </Box>

                    {isAuthenticated && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* Button to open quiz selection dialog */}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleDialogOpen}
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#F5686B',
                                    color: '#F5686B',
                                    '&:hover': { borderColor: '#F5686B' },
                                    mr: 2,
                                }}
                            >
                                Select Quiz
                            </Button>

                            {/* Leaderboard Button */}
                            <Button
                                variant="outlined"
                                color="primary"
                                component={RouterLink}
                                to="/leaderboard"
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#F5686B',
                                    color: '#F5686B',
                                    '&:hover': { borderColor: '#F5686B' },
                                    mr: 2,
                                }}
                                startIcon={<LeaderboardIcon />}
                            >
                                Leaderboard
                            </Button>

                            {/* Logout Button */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleLogoutClick}
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#801BEC',
                                    color: '#801BEC',
                                    '&:hover': { borderColor: '#801BEC' },
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </StyledAppBar>

            {/* Dialog for quiz selection */}
            {isAuthenticated && (
                <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
                    <DialogContent>
                        {isLoading ? (
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <CircularProgress />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    Loading Quizzes...
                                </Typography>
                            </Box>
                        ) : error ? (
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Alert severity="error">{error}</Alert>
                            </Box>
                        ) : (
                            <Grid container spacing={4}>
                                {quizzes.map((quiz) => (
                                    <Grid item xs={12} sm={6} key={quiz.id}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <QuizCard
                                                onClick={() => handleQuizSelect(quiz.id)}
                                                sx={{
                                                    backgroundImage: `url(/images/quizzes/${quiz.subject.toLowerCase().replace(' ', '_')}.jpg)`,
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                        width: '100%',
                                                        py: 1,
                                                    }}
                                                >
                                                    <Typography variant="h6" align="center">
                                                        {quiz.subject}
                                                    </Typography>
                                                </CardContent>
                                            </QuizCard>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Confirm Logout
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to logout?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleLogoutCancel} color="primary" sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleLogoutConfirm} color="secondary" variant="contained">
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default Navbar;
