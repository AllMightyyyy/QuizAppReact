// src/components/Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useSnackbar } from 'notistack';

interface LeaderboardEntry {
    username: string;
    highScore: number;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axiosInstance.get<LeaderboardEntry[]>('/api/users/high-scores');
                setLeaderboard(response.data);
                setLoading(false);
            } catch (err: any) {
                setError('Failed to load leaderboard.');
                enqueueSnackbar('Failed to load leaderboard.', { variant: 'error' });
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [enqueueSnackbar]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading Leaderboard...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                Leaderboard
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>High Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((entry, index) => (
                            <TableRow key={entry.username}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{entry.username}</TableCell>
                                <TableCell>{entry.highScore}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Leaderboard;
