import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, Button } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';

interface NavbarProps {
    onSelectQuiz: (quizPath: string) => void;
}

const StyledAppBar = styled(AppBar)({
    background: 'transparent',
    boxShadow: 'none',
    height: '114px',
    justifyContent: 'center',
    zIndex: 1000,
});

const LogoContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#2C2C2C',
    borderRadius: '10px',
    border: '2px solid #F5686B',
    marginRight: '16px',
    flexGrow: 0,
});

const Navbar: React.FC<NavbarProps> = ({ onSelectQuiz }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleQuizSelect = (quizPath: string, quizName: string) => {
        setSelectedQuiz(quizName);
        setAnchorEl(null);
        onSelectQuiz(quizPath);
    };

    return (
        <StyledAppBar position="static">
            <Toolbar sx={{ minHeight: '114px', px: 4, display: 'flex', justifyContent: 'flex-start' }}>
                {/* Left side: Logo and Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <LogoContainer>
                        <QuizIcon sx={{ color: '#F5686B', fontSize: '2rem' }} />
                    </LogoContainer>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        Quiz App
                    </Typography>
                </Box>

                {/* Middle: Dropdown for selecting quizzes */}
                <Box sx={{ ml: 2 }}> {/* Adds spacing between logo and Select Quiz */}
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleMenuOpen}
                        sx={{
                            textTransform: 'none',
                            borderColor: '#F5686B',
                            color: '#F5686B',
                            '&:hover': { borderColor: '#F5686B' },
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
            </Toolbar>
        </StyledAppBar>
    );
};

const QUIZZES = [
    { name: 'General Knowledge', path: '/tests/general-knowledge.json' },
    { name: 'CRM En Odoo', path: '/tests/CRM-Odoo.json' },
];

export default Navbar;
