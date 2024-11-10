import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, Button, Box, Checkbox } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    background: '#FBFBFB',
    borderRadius: '10px',
    position: 'relative',
}));

const Heading = styled(Typography)(({ theme }) => ({
    color: '#801BEC',
    fontSize: '40px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    wordWrap: 'break-word',
    marginBottom: theme.spacing(2),
}));

interface OptionViewProps {
    options: string[];
    correctAnswer: string | string[]; // Support multiple correct answers
    selectedOption: string | string[];
    onSelect: (option: string | string[]) => void;
    onSubmit: (isCorrect: boolean, timeTaken: number) => void;
}

const OptionView: React.FC<OptionViewProps> = ({ options, correctAnswer, selectedOption, onSelect, onSubmit }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [timeTaken, setTimeTaken] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Start the timer when the component mounts
        setTimer(setInterval(() => setTimeTaken((prevTime) => prevTime + 1), 1000));

        return () => {
            // Clear the timer on unmount
            if (timer) clearInterval(timer);
        };
    }, []);

    const handleSelection = (option: string) => {
        if (Array.isArray(selectedOption)) {
            const updatedSelection = selectedOption.includes(option)
                ? selectedOption.filter((item) => item !== option)
                : [...selectedOption, option];
            onSelect(updatedSelection);
        } else {
            onSelect(option);
        }
    };

    const handleSubmit = () => {
        const correct = Array.isArray(correctAnswer)
            ? Array.isArray(selectedOption) &&
            correctAnswer.sort().join() === selectedOption.sort().join()
            : selectedOption === correctAnswer;
        setIsCorrect(correct);
        setIsSubmitted(true);

        // Stop the timer
        if (timer) clearInterval(timer);

        // Trigger the onSubmit callback with the correctness and time taken
        onSubmit(correct, timeTaken);
    };

    return (
        <StyledCard>
            <CardContent>
                <Heading>Options</Heading>
                <RadioGroup
                    aria-label="quiz-options"
                    name="quiz-options"
                    value={selectedOption}
                    onChange={(e) => onSelect(e.target.value)}
                    sx={{ opacity: isSubmitted ? 0.5 : 1 }} // Dim options after submission
                >
                    {options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option}
                            control={
                                Array.isArray(correctAnswer) ? (
                                    <Checkbox
                                        checked={Array.isArray(selectedOption) && selectedOption.includes(option)}
                                        onChange={() => handleSelection(option)}
                                        color="secondary"
                                    />
                                ) : (
                                    <Radio
                                        checked={selectedOption === option}
                                        onChange={() => onSelect(option)}
                                        color="secondary"
                                    />
                                )
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.span
                                        initial={{ scale: 1 }}
                                        animate={{ scale: isSubmitted && selectedOption === option ? 1.1 : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {option}
                                    </motion.span>
                                    {isSubmitted && (
                                        <Box sx={{ ml: 1 }}>
                                            {Array.isArray(correctAnswer)
                                                ? correctAnswer.includes(option) && <CheckCircleIcon color="success" />
                                                : option === correctAnswer && <CheckCircleIcon color="success" />}
                                            {option === selectedOption &&
                                                option !== correctAnswer &&
                                                !correctAnswer.includes(option) && (
                                                    <CancelIcon color="error" />
                                                )}
                                        </Box>
                                    )}
                                </Box>
                            }
                            disabled={isSubmitted} // Disable after submission
                            sx={{
                                color:
                                    isSubmitted && (correctAnswer.includes(option) || option === correctAnswer)
                                        ? 'green'
                                        : isSubmitted && selectedOption === option && !correctAnswer.includes(option)
                                            ? 'red'
                                            : 'inherit',
                                mb: 1,
                            }}
                        />
                    ))}
                </RadioGroup>

                {/* Feedback Message */}
                {isSubmitted && (
                    <Typography
                        variant="body1"
                        color={isCorrect ? 'green' : 'red'}
                        sx={{ mt: 2, fontWeight: 'bold' }}
                    >
                        {isCorrect
                            ? 'Correct!'
                            : `Incorrect. The correct answer is ${
                                Array.isArray(correctAnswer)
                                    ? correctAnswer.join(', ')
                                    : correctAnswer
                            }.`}
                    </Typography>
                )}

                {/* Timer Display */}
                {!isSubmitted && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Time Elapsed: {timeTaken} seconds
                    </Typography>
                )}

                {/* Submit Button */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!selectedOption || isSubmitted}
                        sx={{ px: 4 }}
                    >
                        Submit
                    </Button>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default OptionView;
