import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { motion } from 'framer-motion';

interface ResultProps {
    totalScore: number;
    totalQuestions: number;
    onRetry: () => void;
}

const Result: React.FC<ResultProps> = ({ totalScore, totalQuestions, onRetry }) => {
    const percentage = ((totalScore / totalQuestions) * 100).toFixed(2);
    const percentageNumber = parseFloat(percentage); // Convert to number for comparison

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
                            Your Score: {totalScore} / {totalQuestions} ({percentage}%)
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                            {percentageNumber >= 80
                                ? 'Excellent work!'
                                : percentageNumber >= 50
                                    ? 'Good effort!'
                                    : 'Better luck next time!'}
                        </Typography>

                        {/* Retry Button */}
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={onRetry}
                                    startIcon={<ReplayIcon />}
                                    sx={{ px: 4 }}
                                >
                                    Retry Quiz
                                </Button>
                            </motion.div>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default Result;
