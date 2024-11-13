import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface CircularProgressIndicatorProps {
    progress: number;
    label: string;
}

const CircularProgressIndicator: React.FC<CircularProgressIndicatorProps> = ({ progress, label }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
            <CircularProgress variant="determinate" value={progress} size={80} thickness={5} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="textSecondary">
                    {`${Math.round(progress)}%`}
                </Typography>
            </Box>
            <Typography
                variant="subtitle1"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#801BEC',
                    fontWeight: 'bold',
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export default CircularProgressIndicator;
