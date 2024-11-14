// src/components/Quiz.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Checkbox, FormControlLabel, FormGroup, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { QuestionResponse } from '../types';

interface QuizProps {
    question: QuestionResponse;
    questionNumber: number;
    totalQuestions: number;
    handleAnswer: (selectedOption: string | string[], isCorrect: boolean) => void;
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

    const isMultiple = false; // Assuming single choice. Adjust if multiple choice is supported.

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
        // Since the correct answer isn't available on the frontend, pass isCorrect as false or true based on backend response
        // The actual correctness is handled by the backend and reflected in the AnswerResponseDTO
        // Here, we'll assume it's incorrect and let the backend handle the actual correctness
        setIsSubmitted(true);
        handleAnswer(selectedOptions, false); // Placeholder, actual correctness handled post submission
        onSubmit();
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
                                        color: isSubmitted ? 'grey.700' : 'inherit',
                                    }}
                                />
                            </motion.div>
                        ))}
                    </FormGroup>
                    {!isSubmitted && (
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={selectedOptions.length === 0}
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
