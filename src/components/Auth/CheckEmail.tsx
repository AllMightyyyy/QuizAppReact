// CheckEmail.tsx
import { Container, Typography } from '@mui/material';

const CheckEmail: React.FC = () => (
    <Container>
        <Typography variant="h5" gutterBottom>
            Please Verify Your Email
        </Typography>
        <Typography>
            We've sent a confirmation email to your address. Please check your inbox and follow the instructions to complete your registration.
        </Typography>
    </Container>
);

export default CheckEmail;
