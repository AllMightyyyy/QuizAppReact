// src/components/QuizContent.tsx
import React, { useState, useContext, useEffect } from 'react';
import { Grid, CircularProgress, Typography, Container, Alert, Button, Box, TextField } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import QuestionCard from './QuestionCard';
import Result from './Result';
import Timer from './Timer';
import { QuestionResponse, UserAnswer, AnswerResponseDTO, QuizResponse } from '../types';
import { useSnackbar } from 'notistack';
import { submitAnswers } from '../services/attemptService';
import { calculateScore } from '../utils/quizUtils';

interface QuizContentProps {
    currentQuizId: number | null;
    attemptId: number | null;
    onRetry: () => void;
}

const QuizContent: React.FC<QuizContentProps> = ({ currentQuizId, attemptId, onRetry }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [totalScore, setTotalScore] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const totalDuration = 300; // Total time in seconds (5 minutes)

    // Timer completion handler
    const handleTimerComplete = () => {
        enqueueSnackbar('Time is up! Submitting your answers.', { variant: 'warning' });
        handleSubmitQuiz(); // Automatically submit the quiz when time runs out
    };

    // Fetch quiz questions
    const { data: quizData, isLoading, isError } = useQuery<QuizResponse>({
        queryKey: ['quizData', currentQuizId],
        queryFn: async () => {
            const response = await axiosInstance.get<QuizResponse>(`/api/quizzes/${currentQuizId}`);
            return response.data;
        },
        enabled: !!currentQuizId && !!attemptId,
        retry: false,
    });

    // Handle query errors
    useEffect(() => {
        if (isError) {
            setError('Failed to load quiz questions.');
            enqueueSnackbar('Failed to load quiz questions.', { variant: 'error' });
        }
    }, [isError, enqueueSnackbar]);

    // Mutation for submitting answers
    const { mutate: submitQuiz, isPending: isSubmitting } = useMutation<
        AnswerResponseDTO,
        Error,
        { userId: number; quizId: number; answers: { [key: number]: string } }
    >({
        mutationFn: submitAnswers,
        onSuccess: (data) => {
            enqueueSnackbar('Quiz submitted successfully!', { variant: 'success' });
            const score = calculateScore(data);
            setTotalScore(score);
            setShowResult(true);
        },
        onError: () => {
            setError('Failed to submit quiz. Please try again.');
            enqueueSnackbar('Failed to submit quiz.', { variant: 'error' });
        },
    });

    // Filtered questions based on search term
    const filteredQuestions = quizData?.questions.filter((question) =>
        question.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAnswer = (selectedOption: string, timeTaken: number) => {
        const questionId = quizData?.questions.find(q => q.options.includes(selectedOption))?.id || 0;
        if (questionId === 0) return; // Invalid questionId

        setUserAnswers((prev) => {
            const existing = prev.find((a) => a.questionId === questionId);
            if (existing) {
                return prev.map((a) =>
                    a.questionId === questionId
                        ? { ...a, selectedOption, timeTaken }
                        : a
                );
            } else {
                return [
                    ...prev,
                    { questionId, selectedOption, timeTaken },
                ];
            }
        });
    };

    const handleSubmitQuiz = () => {
        if (!currentQuizId || !user || !user.id) {
            setError('Invalid quiz attempt.');
            enqueueSnackbar('Invalid quiz attempt.', { variant: 'error' });
            return;
        }

        // Ensure all questions have been answered
        if (quizData && userAnswers.length !== quizData.questions.length) {
            setError('Please answer all questions before submitting.');
            enqueueSnackbar('Please answer all questions before submitting.', { variant: 'warning' });
            return;
        }

        const submissionPayload = {
            userId: user.id,
            quizId: currentQuizId,
            answers: userAnswers.reduce((acc, answer) => {
                if (typeof answer.selectedOption === "string") {
                    acc[answer.questionId] = answer.selectedOption;
                }
                return acc;
            }, {} as { [key: number]: string }),
        };

        submitQuiz(submissionPayload);
    };

    if (!isAuthenticated) {
        return <Typography variant="h6">Please log in to access quizzes.</Typography>;
    }

    if (isError) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Grid container spacing={4}>
                {/* Timer Section */}
                <Grid item xs={12}>
                    <Timer duration={totalDuration} onComplete={handleTimerComplete} />
                </Grid>

                {/* Search Input */}
                <Grid item xs={12}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            label="Search Questions"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Box>
                </Grid>

                {/* Quiz Section */}
                <Grid item xs={12}>
                    {/* Render quiz questions or loading/error/results */}
                    {!currentQuizId ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" gutterBottom>
                                Select a Quiz to Start
                            </Typography>
                        </Box>
                    ) : isLoading ? (
                        <Box sx={{ textAlign: 'center', mt: 10 }}>
                            <CircularProgress />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Loading Quiz...
                            </Typography>
                        </Box>
                    ) : showResult ? (
                        <Result
                            totalScore={totalScore}
                            totalQuestions={quizData?.questions.length || 0}
                            onRetry={() => {
                                setShowResult(false);
                                setUserAnswers([]);
                                onRetry();
                                enqueueSnackbar('You can retry the quiz now.', { variant: 'info' });
                            }}
                        />
                    ) : (
                        filteredQuestions && filteredQuestions.length > 0 ? (
                            filteredQuestions.map((question, index) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    handleAnswer={(selectedOption, timeTaken) => {
                                        handleAnswer(selectedOption, timeTaken);
                                    }}
                                />
                            ))
                        ) : (
                            <Typography variant="h6" align="center">
                                No questions match your search.
                            </Typography>
                        )
                    )}
                    {quizData && !showResult && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitQuiz}
                                disabled={isSubmitting || userAnswers.length !== quizData.questions.length}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default QuizContent;
