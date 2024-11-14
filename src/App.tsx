import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, CssBaseline, ThemeProvider } from '@mui/material';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import EmailConfirmation from './components/Auth/EmailConfirmation';
import ResendConfirmation from './components/Auth/ResendConfirmation';
import Navbar from './components/Navbar/Navbar';
import QuizContent from './components/QuizContent';
import Leaderboard from './components/Leaderboard';
import PrivateRoute from './components/PrivateRoute';
import VantaBackground from "./components/Background/VantaBackground";
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';
import CheckEmail from "./components/Auth/CheckEmail";

const App: React.FC = () => {
    const [currentQuizId, setCurrentQuizId] = useState<number | null>(null);
    const [attemptId, setAttemptId] = useState<number | null>(null);

    const handleSelectQuiz = (quizId: number, attemptId: number) => {
        setCurrentQuizId(quizId);
        setAttemptId(attemptId);
    };

    const handleRetry = () => {
        setCurrentQuizId(null);
        setAttemptId(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <Box>
                    <Navbar onSelectQuiz={handleSelectQuiz} />
                    <VantaBackground />
                    <Container maxWidth="lg" sx={{ mt: 5, position: 'relative', zIndex: 1 }}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <QuizContent
                                            currentQuizId={currentQuizId}
                                            attemptId={attemptId}
                                            onRetry={handleRetry}
                                        />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/check-email" element={<CheckEmail />} />
                            <Route path="/confirm-email" element={<EmailConfirmation />} />
                            <Route path="/resend-confirmation" element={<ResendConfirmation />} />
                            <Route path="/leaderboard" element={
                                <PrivateRoute>
                                    <React.Fragment>
                                        <QuizContent
                                            currentQuizId={currentQuizId}
                                            attemptId={attemptId}
                                            onRetry={handleRetry}
                                        />
                                        <Leaderboard />
                                    </React.Fragment>
                                </PrivateRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Container>
                </Box>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
