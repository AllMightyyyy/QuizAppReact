// src/components/QuestionView/QuestionView.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
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

interface QuestionViewProps {
    question: string;
    questionNumber: number;
    totalQuestions: number;
    isAnswered: boolean;
    isCorrect: boolean | null;
    onNext: () => void;
    onPrevious: () => void;
    onSubmit: () => void;
    isLastQuestion: boolean;
    subject?: string;
}

const QuestionView: React.FC<QuestionViewProps> = ({
                                                       question,
                                                       questionNumber,
                                                       totalQuestions,
                                                       isAnswered,
                                                       isCorrect,
                                                       onNext,
                                                       onPrevious,
                                                       onSubmit,
                                                       isLastQuestion,
                                                       subject,
                                                   }) => {
    const [timeTaken, setTimeTaken] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Start timer on component mount
        setTimer(setInterval(() => setTimeTaken((prev) => prev + 1), 1000));
        return () => {
            if (timer) clearInterval(timer); // Clear timer on component unmount
        };
    }, [questionNumber]); // Reset timer when question changes

    // Stop the timer and submit when user submits
    const handleSubmit = () => {
        if (timer) clearInterval(timer);
        onSubmit();
    };

    return (
        <StyledCard>
            <CardContent>
                <Heading>Question {questionNumber} of {totalQuestions}</Heading>

                {/* Subject and Feedback */}
                {subject && (
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1 }}>
                        Subject: {subject}
                    </Typography>
                )}

                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant="body1"
                            color={isCorrect ? 'green' : 'red'}
                            sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </Typography>
                    </motion.div>
                )}

                {/* Question Box */}
                <Box
                    sx={{
                        background: '#FBFBFB',
                        borderRadius: '10px',
                        border: '1px #801BEC solid',
                        padding: 2,
                        minHeight: '231px',
                        mb: 4,
                    }}
                >
                    <Typography variant="body1">{question}</Typography>
                </Box>

                {/* Timer */}
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Time Taken: {timeTaken} seconds
                </Typography>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={onPrevious} disabled={questionNumber === 1}>
                        Previous
                    </Button>
                    {isLastQuestion ? (
                        <Button variant="contained" color="secondary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={onNext}>
                            Next
                        </Button>
                    )}
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default QuestionView;
