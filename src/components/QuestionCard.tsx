/* src/components/QuestionCard.tsx */
import React, { useState, useEffect } from 'react';
import {
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Typography,
    Box
} from '@mui/material';
import { Question } from '../types';
import { motion } from 'framer-motion';

interface QuestionCardProps {
    question: Question;
    handleAnswer: (selectedOption: string, isCorrect: boolean, timeTaken: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, handleAnswer }) => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeTaken, setTimeTaken] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Start timer when the component mounts
        setTimer(setInterval(() => setTimeTaken((prev) => prev + 1), 1000));
        return () => {
            if (timer) clearInterval(timer); // Clear timer on unmount
        };
    }, []);

    const onSubmit = () => {
        if (selectedOption !== '') {
            // Check if the answer is correct
            const isAnswerCorrect = selectedOption === question.answer;
            setIsCorrect(isAnswerCorrect);
            setIsSubmitted(true);

            // Stop the timer
            if (timer) clearInterval(timer);

            // Send answer data to parent component
            handleAnswer(selectedOption, isAnswerCorrect, timeTaken);
        }
    };

    return (
        <FormControl component="fieldset">
            <Typography variant="h6" sx={{ mb: 2 }}>
                {question.question}
            </Typography>
            <RadioGroup
                aria-label="quiz"
                name={`question-${question.id}`}
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                sx={{ opacity: isSubmitted ? 0.6 : 1 }}
            >
                {question.options.map((option, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ marginBottom: '10px' }}
                    >
                        <FormControlLabel
                            value={option}
                            control={<Radio color="secondary" />}
                            label={option}
                            disabled={isSubmitted}
                            sx={{
                                color:
                                    isSubmitted && option === question.answer
                                        ? 'green'
                                        : isSubmitted && option === selectedOption && option !== question.answer
                                            ? 'red'
                                            : 'inherit',
                                fontWeight:
                                    isSubmitted && option === question.answer ? 'bold' : 'normal',
                                backgroundColor:
                                    isSubmitted && option === question.answer
                                        ? 'rgba(0, 255, 0, 0.1)'
                                        : isSubmitted && option === selectedOption && option !== question.answer
                                            ? 'rgba(255, 0, 0, 0.1)'
                                            : 'transparent',
                                borderRadius: '5px',
                                p: 1,
                            }}
                        />
                    </motion.div>
                ))}
            </RadioGroup>

            {/* Feedback Message */}
            {isSubmitted && (
                <Typography
                    variant="body1"
                    color={isCorrect ? 'green' : 'red'}
                    sx={{ mt: 2, fontWeight: 'bold' }}
                >
                    {isCorrect ? 'Correct!' : `Incorrect. The correct answer is "${question.answer}".`}
                </Typography>
            )}

            {/* Timer Display */}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Time Taken: {timeTaken} seconds
            </Typography>

            {/* Submit Button */}
            <Box sx={{ textAlign: 'right', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    disabled={selectedOption === '' || isSubmitted}
                    sx={{ px: 4 }}
                >
                    Submit
                </Button>
            </Box>
        </FormControl>
    );
};

export default QuestionCard;
