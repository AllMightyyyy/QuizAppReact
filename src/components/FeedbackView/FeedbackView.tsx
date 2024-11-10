// src/components/FeedbackView/FeedbackView.tsx

import React from 'react';
import { Card, CardContent, Typography, Button, Box, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import { styled } from '@mui/system';

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

interface FeedbackViewProps {
    feedback: string;
    onRetry: () => void;
    questions: { id: number; text: string; correct: boolean; userAnswer: string; correctAnswer: string }[]; // Array of questions with answer status
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, onRetry, questions }) => {
    return (
        <StyledCard>
            <CardContent>
                <Heading>Feedback</Heading>

                {/* Summary Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        {feedback}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Total Correct: {questions.filter(q => q.correct).length} / {questions.length}
                    </Typography>
                </Box>

                {/* List of Questions with Answer Status */}
                <List sx={{
                    background: '#FBFBFB',
                    borderRadius: '10px',
                    border: '1px #801BEC solid',
                    padding: 2,
                    maxHeight: '285px',
                    overflowY: 'auto',
                    mb: 4,
                }}>
                    {questions.map((question) => (
                        <ListItem key={question.id} sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemIcon>
                                {question.correct ? (
                                    <CheckCircleIcon color="success" />
                                ) : (
                                    <CancelIcon color="error" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={`Q${question.id}: ${question.text}`}
                                secondary={
                                    question.correct
                                        ? `Your Answer: ${question.userAnswer}`
                                        : `Your Answer: ${question.userAnswer} | Correct Answer: ${question.correctAnswer}`
                                }
                                sx={{ color: question.correct ? 'green' : 'red' }}
                            />
                        </ListItem>
                    ))}
                </List>

                {/* Retry Button */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onRetry}
                        startIcon={<ReplayIcon />}
                        sx={{ px: 4 }}
                    >
                        Retry Quiz
                    </Button>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default FeedbackView;
