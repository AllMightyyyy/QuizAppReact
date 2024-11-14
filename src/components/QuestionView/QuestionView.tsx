/* src/components/QuestionView/QuestionView.tsx */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { styled, Theme } from '@mui/system';
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
        setTimer(setInterval(() => setTimeTaken((prev) => prev + 1), 1000));
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [questionNumber]);

    const handleSubmit = () => {
        if (timer) clearInterval(timer);
        onSubmit();
    };

    return (
        <StyledCard>
            <CardContent>
                <Heading>Question {questionNumber} of {totalQuestions}</Heading>

                {subject && (
                    <Typography variant="subtitle1" color="secondary" sx={{ mb: 1 }}>
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
                            color={isCorrect ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'bold', mb: 2 }}
                        >
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </Typography>
                    </motion.div>
                )}

                {/* Question Box */}
                <Box
                    sx={{
                        background: (theme: Theme) => theme.palette.background.paper,
                        borderRadius: '10px',
                        border: (theme: Theme) => `1px solid ${theme.palette.primary.main}`,
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
                    <Button variant="contained" color="secondary" onClick={onPrevious} disabled={questionNumber === 1}>
                        Previous
                    </Button>
                    {isLastQuestion ? (
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
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
