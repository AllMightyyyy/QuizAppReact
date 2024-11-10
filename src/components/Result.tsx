import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import FeedbackView from './FeedbackView/FeedbackView';
import { Question, UserAnswer } from '../types';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface ResultProps {
    questions: Question[];
    userAnswers: UserAnswer[];
    onRetry: () => void;
}

const Result: React.FC<ResultProps> = ({ questions, userAnswers, onRetry }) => {
    // Function to check if an answer is correct
    const isAnswerCorrect = (userAnswer: string | string[], correctAnswer: string | string[]): boolean => {
        if (Array.isArray(correctAnswer)) {
            return Array.isArray(userAnswer)
                ? correctAnswer.sort().join() === userAnswer.sort().join()
                : correctAnswer.includes(userAnswer);
        }
        return Array.isArray(userAnswer) ? userAnswer.includes(correctAnswer) : userAnswer === correctAnswer;
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((question) => {
            const userAnswer = userAnswers.find((ua) => ua.questionId === question.id)?.selectedOption;
            if (userAnswer && isAnswerCorrect(userAnswer, question.answer)) {
                score += 1;
            }
        });
        return score;
    };

    const score = calculateScore();
    const total = questions.length;

    // Generate feedback string
    const feedback = `You answered ${score} out of ${total} questions correctly. ${
        score === total ? 'Excellent work!' : 'Keep practicing to improve your score!'
    }`;

    // Prepare detailed feedback data for each question
    const detailedFeedback = questions.map((question) => {
        const userAnswer = userAnswers.find((ua) => ua.questionId === question.id)?.selectedOption || '';
        const correct = isAnswerCorrect(userAnswer, question.answer);
        return {
            id: question.id,
            text: question.question,
            correct,
            userAnswer: Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer,
            correctAnswer: Array.isArray(question.answer) ? question.answer.join(', ') : question.answer,
        };
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Quiz Results
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Your Score: {score} / {total}
                    </Typography>

                    {/* Feedback Summary */}
                    <Box mt={4}>
                        <FeedbackView feedback={feedback} onRetry={onRetry} questions={detailedFeedback} />
                    </Box>

                    {/* Detailed Feedback for Each Question */}
                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom>
                            Detailed Feedback
                        </Typography>
                        <List>
                            {detailedFeedback.map((question) => (
                                <ListItem key={question.id} sx={{ mb: 2, alignItems: 'flex-start' }}>
                                    <ListItemIcon>
                                        {question.correct ? (
                                            <CheckCircleIcon color="success" />
                                        ) : (
                                            <CancelIcon color="error" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                Q{question.id}: {question.text}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    variant="body2"
                                                    color={question.correct ? 'green' : 'red'}
                                                >
                                                    Your Answer: {question.userAnswer}
                                                </Typography>
                                                {!question.correct && (
                                                    <Typography variant="body2" color="textSecondary">
                                                        Correct Answer: {question.correctAnswer}
                                                    </Typography>
                                                )}
                                            </>
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Retry Button */}
                    <Box mt={4} sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onRetry}
                            sx={{ px: 4 }}
                        >
                            Retry Quiz
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default Result;
