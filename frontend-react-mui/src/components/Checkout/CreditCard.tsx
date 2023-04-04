// src/components/CreditCard.tsx
import { useState } from 'react';
import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useBilling } from '../../contexts/BillingContext';

const CreditCard = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [card, setCard] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCard({ ...card, [e.target.name]: e.target.value });
    };

    const { addCreditCard } = useBilling();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await addCreditCard(card);
            navigate('/summary');
          } catch (err) {
            setError('An error occurred while adding the credit card. Please try again.');
          }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '750px',
                    margin: '0 auto',
                    padding: 2,
                    marginTop: 3,
                }}
            >
                <Typography variant="h4" component="h2">
                    Add Credit Card
                </Typography>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowForwardIcon />}
                >
                    Continue to summary
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '750px',
                    margin: '0 auto',
                    padding: 2,
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ width: '100%', marginTop: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={card.cardNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Expiry Month"
                    name="expiryMonth"
                    value={card.expiryMonth}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Expiry Year"
                    name="expiryYear"
                    value={card.expiryYear}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="CVV"
                    name="cvv"
                    value={card.cvv}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
            </Box>
        </Box>
    );
};

export default CreditCard;
