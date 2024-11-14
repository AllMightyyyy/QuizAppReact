// src/components/Quiz.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, Checkbox, FormControlLabel, FormGroup, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Question } from '../types';

interface QuizProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    handleAnswer: (selectedOption: string | string[], isCorrect: boolean, timeTakenSeconds: number) => void;
    onSubmit: () => void;
}

const Quiz: React.FC<QuizProps> = ({
                                       question,
                                       questionNumber,
                                       totalQuestions,
                                       handleAnswer,
                                       onSubmit,
                                   }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeTaken, setTimeTaken] = useState<number>(0);

    const isMultiple = Array.isArray(question.answer);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeTaken((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleOptionChange = (option: string) => {
        if (isMultiple) {
            setSelectedOptions((prev) =>
                prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option]
            );
        } else {
            setSelectedOptions([option]);
        }
    };

    const handleSubmit = () => {
        let correct = false;
        if (isMultiple) {
            correct =
                (question.answer as string[]).length === selectedOptions.length &&
                (question.answer as string[]).every((ans) => selectedOptions.includes(ans));
        } else {
            correct = selectedOptions[0] === question.answer;
        }

        setIsCorrect(correct);
        setIsSubmitted(true);
        handleAnswer(selectedOptions, correct, timeTaken);
    };

    return (
        <Box sx={{ mb: 4 }}>
            <LinearProgress
                variant="determinate"
                value={(questionNumber / totalQuestions) * 100}
                sx={{ height: 10, borderRadius: 5, mb: 3 }}
            />
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Question {questionNumber} of {totalQuestions}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {question.question}
                    </Typography>
                    {isMultiple ? (
                        <FormGroup>
                            {question.options.map((option, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedOptions.includes(option)}
                                                onChange={() => handleOptionChange(option)}
                                                disabled={isSubmitted}
                                                color="secondary"
                                            />
                                        }
                                        label={option}
                                        sx={{
                                            color: isSubmitted && (question.answer as string[]).includes(option)
                                                ? 'green'
                                                : isSubmitted && selectedOptions.includes(option) && !(question.answer as string[]).includes(option)
                                                    ? 'red'
                                                    : 'inherit',
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </FormGroup>
                    ) : (
                        <Box>
                            {question.options.map((option, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <Button
                                        variant={selectedOptions.includes(option) ? 'contained' : 'outlined'}
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleOptionChange(option)}
                                        disabled={isSubmitted}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            textTransform: 'none',
                                        }}
                                    >
                                        {option}
                                    </Button>
                                </motion.div>
                            ))}
                        </Box>
                    )}
                    {isSubmitted && (
                        <Typography variant="body1" sx={{ mt: 2, color: isCorrect ? 'green' : 'red' }}>
                            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is "${question.answer}".`}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Time Taken: {timeTaken} seconds
                    </Typography>
                    {!isSubmitted && (
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isMultiple ? selectedOptions.length === 0 : selectedOptions.length === 0}
                            >
                                Submit
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default Quiz;
