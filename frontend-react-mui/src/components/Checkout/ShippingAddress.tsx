import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useBilling } from '../../contexts/BillingContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ShippingAddress = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const { hasCard, hasAddress, addShippingAddress } = useBilling();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await addShippingAddress(address);
            navigate(hasCard() ? '/summary' : '/payment');
        } catch (err) {
            setError('An error occurred while adding the shipping address. Please try again.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}>
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
                    Add Shipping Address
                </Typography>
                {!hasCard() && (
                    <Button
                        startIcon={<CreditCardIcon />}
                        variant="contained"
                        color="primary"
                        type='submit'
                    >
                        Continue to Payment
                    </Button>
                )}
                {hasCard() && (
                    <Button
                        startIcon={<ArrowForwardIcon />}
                        variant="contained"
                        color="primary"
                        type='submit'
                    >
                        Continue to Summary
                    </Button>
                )}
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
                    label="Street"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="State"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Country"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Postal Code"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
            </Box>
        </Box>
    );

};

export default ShippingAddress;
