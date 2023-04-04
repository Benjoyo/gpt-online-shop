// Checkout.tsx
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import React from 'react';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useCart } from '../../contexts/CartContext';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useBilling } from '../../contexts/BillingContext';

export interface CheckoutItem {
    product: {
        id: number;
        name: string;
        description: string;
        imageUrl: string;
        price: number;
    };
    quantity: number;
}

export interface CheckoutResponse {
    items: CheckoutItem[];
    total: number;
}

export const Checkout: React.FC = () => {
    const { cartItems } = useCart();
    const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(null);

    const navigate = useNavigate();

    const { hasAddress, hasCard } = useBilling();

    useEffect(() => {
        const checkoutCart = async () => {
            const response = await api.post<CheckoutResponse>('/cart/checkout', cartItems);
            setCheckoutData(response.data);
        };

        checkoutCart();
    }, [cartItems]);

    return (
        <Box sx={{
            margin: '0 auto',
            marginTop: 3,
            maxWidth: '750px',
            padding: 2,
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Typography variant="h4" component="div">
                    Checkout
                </Typography>
                {hasAddress() && !hasCard() && (
                    <Button
                        startIcon={<CreditCardIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/payment')}
                    >
                        Continue to Payment
                    </Button>
                )}
                {hasAddress() && hasCard() && (
                    <Button
                        startIcon={<ArrowForwardIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/summary')}
                    >
                        Continue to Summary
                    </Button>
                )}
                {!hasAddress() && (
                    <Button
                        startIcon={<AddLocationIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/shipping-address')}
                    >
                        Continue to Shipping
                    </Button>
                )}
            </Box>
            <List>
                {checkoutData && checkoutData.items.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${item.product.name} (x${item.quantity})`}
                            secondary={`$${(item.product.price * item.quantity).toFixed(2)}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h5">
                Grand Total: ${checkoutData ? checkoutData.total.toFixed(2) : '0.00'}
            </Typography>
        </Box>
    );
};

export default Checkout;
