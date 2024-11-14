// src/components/Result.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { motion } from 'framer-motion';

interface ResultProps {
    pointsEarned: number;
    totalQuestions: number;
    onRetry: () => void;
}

const Result: React.FC<ResultProps> = ({ pointsEarned, totalQuestions, onRetry }) => {
    const feedback = pointsEarned === totalQuestions
        ? 'Excellent work!'
        : 'Keep practicing to improve your score!';

    return (
        <Box sx={{ mt: 4 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom align="center">
                            Quiz Results
                        </Typography>
                        <Typography variant="h6" align="center">
                            Your Score: {pointsEarned} / {totalQuestions}
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                            {feedback}
                        </Typography>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<ReplayIcon />}
                                onClick={onRetry}
                            >
                                Retry Quiz
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Result;
