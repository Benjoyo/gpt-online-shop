// src/components/CompletePurchase.tsx

import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutItem, CheckoutResponse } from "./Checkout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCart } from "../../contexts/CartContext";
import { useBilling } from "../../contexts/BillingContext";
import { completePurchase } from "../../services/orderService";
import api from "../../utils/api";
import { Address, CreditCard } from "../../services/userService";

const CompletePurchase: React.FC = () => {

    const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(
        null
    );
    const navigate = useNavigate();

    const {
        billingInfo,
        hasAddress,
        hasCard,
    } = useBilling();

    const {
        clearCart
      } = useCart();

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        null
    );
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    useEffect(() => {
        if (!billingInfo) return;
        if (hasAddress()) {
            setSelectedAddressId(billingInfo.addresses[0].id || null);
        }
        if (hasCard()) {
            setSelectedCardId(billingInfo.cards[0].id || null);
        }
    }, [billingInfo, hasAddress, hasCard]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.post<CheckoutResponse>('/cart/checkout');
            setCheckoutData(response.data);
        };
        fetchData();
    }, []);

    const [error, setError] = useState<string | null>(null);

    const handleCompletePurchase = async () => {
        if (selectedAddressId && selectedCardId) {
            try {
                await completePurchase(selectedCardId, selectedAddressId);
                clearCart();
                navigate("/orders");
            } catch (err) {
                setError("An error occurred while completing the purchase. Please try again.");
            }
        }
    };

    return (
        <Box
            sx={{
                margin: "0 auto",
                marginTop: 3,
                maxWidth: "750px",
                padding: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2
                }}
            >
                <Typography variant="h4" component="div">
                    Complete Purchase
                </Typography>
            </Box>
            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}
            {billingInfo && (
                <>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="address-select-label">Shipping Address</InputLabel>
                        <Select
                            labelId="address-select-label"
                            value={selectedAddressId || ""}
                            onChange={(e) => setSelectedAddressId(e.target.value as number)}
                        >
                            {billingInfo.addresses.map((address: Address) => (
                                <MenuItem key={address.id} value={address.id}>
                                    {address.street}, {address.city}, {address.state}, {address.country}, {address.postalCode}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="card-select-label">Credit Card</InputLabel>
                        <Select
                            labelId="card-select-label"
                            value={selectedCardId || ""}
                            onChange={(e) => setSelectedCardId(e.target.value as number)}
                        >
                            {billingInfo.cards.map((card: CreditCard) => (
                                <MenuItem key={card.id} value={card.id}>
                                    {card.cardNumber}, {card.expiryMonth}/{card.expiryYear}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}
            <List>
                {checkoutData &&
                    checkoutData.items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`${item.product.name} (x${item.quantity})`}
                                secondary={`$${(item.product.price * item.quantity).toFixed(2)}`}
                            />
                        </ListItem>
                    ))}
            </List>
            <Typography variant="h5">
                Grand Total: ${checkoutData ? checkoutData.total.toFixed(2) : "0.00"}
            </Typography>
            {checkoutData && checkoutData.items.length > 0 && (
            <Box
                sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    startIcon={<CheckCircleIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleCompletePurchase}
                    disabled={!selectedAddressId || !selectedCardId}
                >
                    Buy Now
                </Button>
            </Box>
            )}
        </Box>

    );
};

export default CompletePurchase;