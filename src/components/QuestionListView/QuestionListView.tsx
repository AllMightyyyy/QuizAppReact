// src/components/QuestionListView/QuestionListView.tsx

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Box,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';
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

interface QuestionListViewProps {
    questions: { id: number; text: string; answered: boolean; correct: boolean | null }[];
    currentQuestionId: number;
    onSelect: (id: number) => void;
}

const QuestionListView: React.FC<QuestionListViewProps> = ({
                                                               questions,
                                                               currentQuestionId,
                                                               onSelect,
                                                           }) => {
    return (
        <StyledCard>
            <CardContent>
                <Heading>Question List</Heading>

                <List>
                    {questions.map((question) => (
                        <ListItem key={question.id} disablePadding>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%' }}
                            >
                                <ListItemButton
                                    selected={question.id === currentQuestionId}
                                    onClick={() => onSelect(question.id)}
                                    disabled={question.answered && question.correct !== null} // Lock if answered
                                    sx={{
                                        backgroundColor:
                                            question.id === currentQuestionId ? '#e1d7f7' : 'transparent',
                                        '&:hover': { backgroundColor: '#f3e8ff' },
                                        mb: 1,
                                        borderRadius: '8px',
                                    }}
                                >
                                    <ListItemIcon>
                                        {question.answered ? (
                                            question.correct ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <CancelIcon color="error" />
                                            )
                                        ) : (
                                            <CircleIcon sx={{ color: '#801BEC' }} />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`Question ${question.id}`}
                                        sx={{
                                            color:
                                                question.answered && question.correct === true
                                                    ? 'green'
                                                    : question.answered && question.correct === false
                                                        ? 'red'
                                                        : 'inherit',
                                            fontWeight:
                                                question.id === currentQuestionId ? 'bold' : 'normal',
                                        }}
                                    />
                                </ListItemButton>
                            </motion.div>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </StyledCard>
    );
};

export default QuestionListView;
