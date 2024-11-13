import React, { useState } from 'react';
import { Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, Button, Box, Checkbox } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    height: '100%',
    background: theme.palette.background.paper,
    borderRadius: '10px',
    position: 'relative',
}));

const Heading = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: '2.5rem',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    wordWrap: 'break-word',
    marginBottom: theme.spacing(2),
}));

interface OptionViewProps {
    options: string[];
    correctAnswer: string | string[];
    selectedOption: string | string[];
    onSelect: (option: string | string[]) => void;
    handleAnswer: (selectedOption: string | string[], isCorrect: boolean, timeTaken: number) => void;
    timeTaken: number;
}

const OptionView: React.FC<OptionViewProps> = ({
                                                   options,
                                                   correctAnswer,
                                                   selectedOption,
                                                   onSelect,
                                                   handleAnswer,
                                                   timeTaken,
                                               }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

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
        handleAnswer(selectedOption, correct, timeTaken);
    };

    return (
        <StyledCard>
            <CardContent>
                <Heading>Options</Heading>
                <RadioGroup
                    aria-label="quiz-options"
                    name="quiz-options"
                    value={Array.isArray(selectedOption) ? '' : selectedOption}
                    onChange={(e) => onSelect(e.target.value)}
                    sx={{ opacity: isSubmitted ? 0.5 : 1 }}
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
                                        animate={{ scale: isSubmitted && (Array.isArray(selectedOption) ? selectedOption.includes(option) : selectedOption === option) ? 1.1 : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {option}
                                    </motion.span>
                                    {isSubmitted && (
                                        <Box sx={{ ml: 1 }}>
                                            {Array.isArray(correctAnswer)
                                                ? correctAnswer.includes(option) && <CheckCircleIcon color="success" />
                                                : option === correctAnswer && <CheckCircleIcon color="success" />}
                                            {((Array.isArray(correctAnswer) && Array.isArray(selectedOption) && selectedOption.includes(option) && !correctAnswer.includes(option)) ||
                                                (!Array.isArray(correctAnswer) && selectedOption === option && option !== correctAnswer)) && (
                                                <CancelIcon color="error" />
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            }
                            disabled={isSubmitted}
                            sx={{
                                color:
                                    isSubmitted && (Array.isArray(correctAnswer) ? correctAnswer.includes(option) : option === correctAnswer)
                                        ? 'green'
                                        : isSubmitted && ((Array.isArray(selectedOption) && selectedOption.includes(option) && !Array.isArray(correctAnswer)) || (selectedOption === option && option !== correctAnswer))
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
                        color={isCorrect ? 'success.main' : 'error.main'}
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
            </CardContent>
        </StyledCard>
    );
};

export default OptionView;
