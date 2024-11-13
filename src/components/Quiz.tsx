import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Stack, Button } from '@mui/material';
import OptionView from './OptionView/OptionView';
import { Question } from '../types';
import { motion } from 'framer-motion';

interface QuizProps {
    question: Question;
    totalQuestions: number;
    currentQuestionIndex: number;
    handleAnswer: (selectedOption: string | string[], isCorrect: boolean, timeTaken: number) => void;
}

const Quiz: React.FC<QuizProps> = ({
                                       question,
                                       totalQuestions,
                                       currentQuestionIndex,
                                       handleAnswer,
                                   }) => {
    const [selectedOption, setSelectedOption] = useState<string | string[]>('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeTaken, setTimeTaken] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    useEffect(() => {
        setIsSubmitted(false);
        setIsCorrect(null);
        setSelectedOption('');
        setTimeTaken(0);

        const intervalId = setInterval(() => setTimeTaken((prev) => prev + 1), 1000);
        setTimer(intervalId);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [question]);

    const onSubmit = () => {
        if (selectedOption) {
            const isAnswerCorrect = Array.isArray(question.answer)
                ? Array.isArray(selectedOption)
                    ? selectedOption.sort().join() === question.answer.sort().join()
                    : question.answer.includes(selectedOption)
                : selectedOption === question.answer;
            setIsCorrect(isAnswerCorrect);
            setIsSubmitted(true);

            if (timer) clearInterval(timer);
            handleAnswer(selectedOption, isAnswerCorrect, timeTaken);
        }
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </Typography>
                <Typography variant="subtitle1">Subject: {question.subject}</Typography>
            </Stack>

            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5, mb: 3 }}
            />

            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {question.question}
                        </Typography>
                        <OptionView
                            options={question.options}
                            correctAnswer={question.answer}
                            selectedOption={selectedOption}
                            onSelect={setSelectedOption}
                            handleAnswer={(selectedOption, isCorrect, timeTaken) => {
                                setIsCorrect(isCorrect);
                                setIsSubmitted(true);
                                handleAnswer(selectedOption, isCorrect, timeTaken);
                            }}
                            timeTaken={timeTaken}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Typography
                        variant="body1"
                        color={isCorrect ? 'success.main' : 'error.main'}
                        sx={{ mt: 2, fontWeight: 'bold' }}
                    >
                        {isCorrect ? 'Correct!' : `Incorrect. The correct answer is "${Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}".`}
                    </Typography>
                </motion.div>
            )}

            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Time Taken: {timeTaken} seconds
            </Typography>

            <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    disabled={!selectedOption || isSubmitted}
                    sx={{
                        px: 4,
                        backgroundColor: !selectedOption || isSubmitted ? 'grey.400' : 'primary.main',
                        color: !selectedOption || isSubmitted ? 'grey.700' : 'primary.contrastText',
                        '&:hover': {
                            backgroundColor: !selectedOption || isSubmitted ? 'grey.400' : 'primary.dark',
                        },
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default Quiz;
