// src/components/QuizContent.tsx
import React, { useState, useContext } from 'react';
import { Box, CircularProgress, Typography, Container, Alert, Button } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import Quiz from './Quiz';
import Result from './Result';
import { Question, UserAnswer } from '../types';
import { useSnackbar } from 'notistack';

interface QuizContentProps {
    currentQuizId: number | null;
    attemptId: number | null;
}

const QuizContent: React.FC<QuizContentProps> = ({ currentQuizId, attemptId }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Fetch questions for the selected quiz
    const questionsQuery = useQuery(
        ['quizQuestions', currentQuizId],
        async () => {
            const response = await axiosInstance.get<{ questions: Question[] }>(`/api/quizzes/${currentQuizId}`);
            return response.data.questions;
        },
        {
            enabled: !!currentQuizId && !!attemptId,
            onError: (err: Error) => {
                setError('Failed to load quiz questions.');
                enqueueSnackbar('Failed to load quiz questions.', { variant: 'error' });
            },
            retry: false, // Prevent infinite retries
        }
    );

    // Mutation for submitting the quiz
    const submissionMutation = useMutation(
        async (submission: { /* your submission type */ }) => {
            const response = await axiosInstance.post('/api/attempts/submit', submission);
            return response.data;
        },
        {
            onSuccess: (data) => {
                enqueueSnackbar('Quiz submitted successfully!', { variant: 'success' });
                setShowResult(true);
            },
            onError: (err: Error) => {
                setError('Failed to submit quiz. Please try again.');
                enqueueSnackbar('Failed to submit quiz.', { variant: 'error' });
            },
        }
    );

    // Function to start a quiz (triggered via Navbar)
    const startQuiz = (quizId: number, attemptId: number) => {
        setCurrentQuizId(quizId);
        setAttemptId(attemptId);
    };

    // Handle answer submission for each question
    const handleAnswer = (questionId: number, selectedOption: string | string[], isCorrect: boolean, timeTakenSeconds: number) => {
        setUserAnswers((prev) => {
            const existing = prev.find((a) => a.questionId === questionId);
            if (existing) {
                return prev.map((a) =>
                    a.questionId === questionId ? { ...a, selectedOption, timeTakenSeconds } : a
                );
            } else {
                return [...prev, { questionId, selectedOption, isCorrect, timeTakenSeconds }];
            }
        });
    };

    // Submit the quiz with accumulated answers
    const submitQuiz = () => {
        if (!currentQuizId || !attemptId) {
            setError('Invalid quiz attempt.');
            enqueueSnackbar('Invalid quiz attempt.', { variant: 'error' });
            return;
        }

        const totalTimeTaken = userAnswers.reduce((acc, curr) => acc + curr.timeTakenSeconds, 0);

        const submission = {
            quizId: currentQuizId,
            attemptId: attemptId,
            totalTimeTaken,
            retry: false,
            questions: userAnswers.map((ua) => ({
                questionId: ua.questionId,
                selectedOption: ua.selectedOption,
                timeTakenSeconds: ua.timeTakenSeconds,
            })),
        };

        submissionMutation.mutate(submission);
    };

    if (!isAuthenticated) {
        return <Typography variant="h6">Please log in to access quizzes.</Typography>;
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            {!currentQuizId ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Select a Quiz to Start
                    </Typography>
                </Box>
            ) : questionsQuery.isLoading ? (
                <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading Quiz...
                    </Typography>
                </Box>
            ) : showResult && submissionMutation.status === 'success' ? (
                <Result
                    pointsEarned={submissionMutation.data?.pointsEarned || 0}
                    totalQuestions={questionsQuery.data?.length || 0}
                    onRetry={() => {
                        setShowResult(false);
                        setUserAnswers([]);
                        setCurrentQuizId(null);
                        setAttemptId(null);
                        enqueueSnackbar('You can retry the quiz now.', { variant: 'info' });
                    }}
                />
            ) : (
                questionsQuery.data?.map((question, index) => (
                    <Quiz
                        key={question.id}
                        question={question}
                        questionNumber={index + 1}
                        totalQuestions={questionsQuery.data.length}
                        handleAnswer={(selectedOption, isCorrect, timeTakenSeconds) =>
                            handleAnswer(question.id, selectedOption, isCorrect, timeTakenSeconds)
                        }
                        onSubmit={submitQuiz}
                    />
                ))
            )}
            {/* Submit Quiz Button */}
            {questionsQuery.data && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submitQuiz}
                        disabled={userAnswers.length !== questionsQuery.data.length || submissionMutation.status === 'pending'}
                    >
                        {submissionMutation.status === 'pending' ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default QuizContent;
