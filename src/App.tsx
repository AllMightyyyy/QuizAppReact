import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Typography, Box, Grid } from '@mui/material';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Navbar from './components/Navbar/Navbar';
import QuestionListView from './components/QuestionListView/QuestionListView';
import { Question, UserAnswer } from './types';

const App: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [quizPath, setQuizPath] = useState<string | null>(null);

    useEffect(() => {
        if (quizPath) {
            setLoading(true);
            fetch(quizPath)
                .then((res) => res.json())
                .then((data: Question[]) => {
                    setQuestions(data);
                    setLoading(false);
                    setShowResult(false);
                    setUserAnswers([]);
                    setCurrentQuestionIndex(0);
                })
                .catch((err) => {
                    console.error('Error loading questions:', err);
                    setLoading(false);
                });
        }
    }, [quizPath]);

    const handleAnswer = (selectedOption: string | string[], isCorrect: boolean, timeTaken: number) => {
        const currentQuestion = questions[currentQuestionIndex];
        const answer: UserAnswer = {
            questionId: currentQuestion.id,
            selectedOption,
            isCorrect,
            timeTaken,
        };

        setUserAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex((a) => a.questionId === currentQuestion.id);
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
        const index = questions.findIndex((q) => q.id === id);
        if (index !== -1) {
            setCurrentQuestionIndex(index);
        }
    };

    const handleRetry = () => {
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
        setShowResult(false);
    };

    return (
        <Box>
            {/* Navbar */}
            <Navbar onSelectQuiz={(quizPath) => setQuizPath(quizPath)} />

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                {loading && quizPath ? (
                    // Only show loading if we're fetching quiz data
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <CircularProgress />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Loading Quiz...
                        </Typography>
                    </Box>
                ) : quizPath && questions.length > 0 ? (
                    // Show the quiz content
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <QuestionListView
                                questions={questions.map((q) => ({
                                    id: q.id,
                                    text: q.question,
                                    answered: userAnswers.some((a) => a.questionId === q.id),
                                    correct: userAnswers.find((a) => a.questionId === q.id)?.isCorrect ?? null,
                                }))}
                                currentQuestionId={questions[currentQuestionIndex].id}
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
                    // Prompt to select a quiz if no quizPath is defined
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
