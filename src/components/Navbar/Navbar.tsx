// src/components/Navbar/Navbar.tsx

import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Button, TextField } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';

interface NavbarProps {
    onSelectQuiz: (quizPath: string) => void;
    onSetThreeDText: (text: string) => void; // New prop for setting 3D Text
}

// Styled AppBar
const StyledAppBar = styled(AppBar)({
    background: '#FBFBFB',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    height: '114px',
    justifyContent: 'center',
});

// Styled logo box
const LogoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#FBFBFB',
    borderRadius: '10px',
    border: '1px #801BEC solid',
    marginRight: '16px',
});

// Predefined list of quizzes
const QUIZZES = [
    { name: 'General Knowledge', path: '/tests/general-knowledge.json' },
    { name: 'CRM En Odoo', path: '/tests/CRM-Odoo.json' },
];

const Navbar: React.FC<NavbarProps> = ({ onSelectQuiz, onSetThreeDText }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
    const [inputText, setInputText] = useState<string>(''); // State for input field

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleQuizSelect = (quizPath: string, quizName: string) => {
        setSelectedQuiz(quizName);
        setAnchorEl(null);
        onSelectQuiz(quizPath); // Notify the parent of the selected quiz path
    };

    const handleSubmit = () => {
        if (inputText.trim() !== '') {
            onSetThreeDText(inputText.trim()); // Set the 3D Text
            setInputText(''); // Clear input field
        }
    };

    return (
        <StyledAppBar position="static">
            <Toolbar sx={{ minHeight: '114px', px: 4, display: 'flex', justifyContent: 'space-between' }}>
                {/* Left side: Logo and Title */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Logo with Quiz Icon */}
                    <LogoContainer>
                        <QuizIcon sx={{ color: '#801BEC', fontSize: '2rem' }} />
                    </LogoContainer>

                    {/* Title */}
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        Quiz App
                    </Typography>
                </Box>

                {/* Middle: Dropdown for selecting quizzes */}
                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleMenuOpen}
                        sx={{
                            textTransform: 'none',
                            borderColor: '#801BEC',
                            color: '#801BEC',
                            '&:hover': { borderColor: '#801BEC' },
                        }}
                        aria-label="Select Quiz"
                    >
                        {selectedQuiz ? `Quiz: ${selectedQuiz}` : 'Select Quiz'}
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {QUIZZES.map((quiz) => (
                            <MenuItem key={quiz.name} onClick={() => handleQuizSelect(quiz.path, quiz.name)}>
                                {quiz.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Right side: Text input and submit button */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Enter 3D Text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        sx={{ mr: 1, backgroundColor: 'white', borderRadius: '4px' }}
                        inputProps={{ 'aria-label': '3D Text Input' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        aria-label="Submit 3D Text"
                    >
                        Submit
                    </Button>

                    {/* Additional Menu Icon */}
                    <IconButton edge="end" color="inherit" aria-label="menu" sx={{ ml: 2 }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default Navbar;
