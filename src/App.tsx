// src/App.tsx

import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Typography, Box, Grid } from '@mui/material';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Navbar from './components/Navbar/Navbar';
import QuestionListView from './components/QuestionListView/QuestionListView';
import { Question, UserAnswer } from './types';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizQuestions } from './services/quizService';
import ParticleBackground from "./components/Background/ParticleBackground";

const App: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [quizPath, setQuizPath] = useState<string | null>(null);
    const [threeDText, setThreeDText] = useState<string>(''); // State for 3D Text

    const {
        data: questions,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<Question[], Error>({
        queryKey: ['quizQuestions', quizPath],
        queryFn: () => fetchQuizQuestions(quizPath as string),
        enabled: !!quizPath, // Only fetch when quizPath is set
    });

    useEffect(() => {
        if (questions) {
            setShowResult(false);
            setUserAnswers([]);
            setCurrentQuestionIndex(0);
        }
    }, [questions]);

    useEffect(() => {
        if (isError && error) {
            console.error('Error fetching quiz questions:', error.message);
        }
    }, [isError, error]);

    const handleAnswer = (
        selectedOption: string | string[],
        isCorrect: boolean,
        timeTaken: number
    ) => {
        if (!questions) return;
        const currentQuestion = questions[currentQuestionIndex];
        const answer: UserAnswer = {
            questionId: currentQuestion.id,
            selectedOption,
            isCorrect,
            timeTaken,
        };

        setUserAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(
                (a) => a.questionId === currentQuestion.id
            );
            if (existingAnswerIndex !== -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex] = answer;
                return updatedAnswers;
            } else {
                return [...prevAnswers, answer];
            }
        });

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleSelectQuestion = (id: number) => {
        if (!questions) return;
        const index = questions.findIndex((q) => q.id === id);
        if (index !== -1) {
            setCurrentQuestionIndex(index);
        }
    };

    const handleRetry = () => {
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
        setShowResult(false);
        refetch();
    };

    const handleSetThreeDText = (text: string) => {
        setThreeDText(text); // Update 3D Text state
    };

    return (
        <Box>
            {/* Navbar */}
            <Navbar onSelectQuiz={(path) => setQuizPath(path)} onSetThreeDText={handleSetThreeDText} />

            {/* 3D Particle Background with 3D Text */}
            <ParticleBackground threeDText={threeDText} />

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 5, position: 'relative', zIndex: 1 }}>
                {isLoading && quizPath ? (
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <CircularProgress />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading Quiz...
                        </Typography>
                    </Box>
                ) : isError ? (
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Typography variant="h6" color="error">
                            Failed to load quiz. Please try again later.
                        </Typography>
                    </Box>
                ) : quizPath && questions && questions.length > 0 ? (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <QuestionListView
                                questions={questions.map((q) => ({
                                    id: q.id,
                                    text: q.question,
                                    answered: userAnswers.some(
                                        (a) => a.questionId === q.id
                                    ),
                                    correct:
                                        userAnswers.find(
                                            (a) => a.questionId === q.id
                                        )?.isCorrect ?? null,
                                }))}
                                currentQuestionId={
                                    questions[currentQuestionIndex].id
                                }
                                onSelect={handleSelectQuestion}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            {!showResult ? (
                                <Quiz
                                    question={questions[currentQuestionIndex]}
                                    totalQuestions={questions.length}
                                    currentQuestionIndex={currentQuestionIndex}
                                    handleAnswer={handleAnswer}
                                />
                            ) : (
                                <Result
                                    questions={questions}
                                    userAnswers={userAnswers}
                                    onRetry={handleRetry}
                                />
                            )}
                        </Grid>
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Please select a quiz to start.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );

};

export default App;
