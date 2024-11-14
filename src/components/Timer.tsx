import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Box, Typography } from '@mui/material';

interface TimerProps {
    duration: number; // Total time in seconds
    onComplete: () => void; // Callback when the timer completes
}

const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
    return (
        <Box
            sx={{
                position: 'sticky',
                top: 20,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
            }}
        >
            <CountdownCircleTimer
                isPlaying
                duration={duration}
                colors={['#00C851', '#FFBB33', '#FF4444']}
                colorsTime={[duration, duration / 2, 0]}
                onComplete={onComplete}
                size={90}
                strokeWidth={8}
            >
                {({ remainingTime }) => (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">{Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60}</Typography>
                        <Typography variant="caption">Time Left</Typography>
                    </Box>
                )}
            </CountdownCircleTimer>
        </Box>
    );
};

export default Timer;
