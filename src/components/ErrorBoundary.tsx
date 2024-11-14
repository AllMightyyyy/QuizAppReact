// src/components/ErrorBoundary.tsx
import React, { ErrorInfo } from 'react';
import { Typography, Container, Box, Button } from '@mui/material';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: 'center', mt: 10 }}>
                        <Typography variant="h4" gutterBottom>
                            Something went wrong.
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Please try reloading the page.
                        </Typography>
                        <Button variant="contained" color="primary" onClick={this.handleReload}>
                            Reload Page
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
