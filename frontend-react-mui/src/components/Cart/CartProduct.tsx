import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../types/cart';
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

interface CartProductProps {
    cartItem: CartItem;
}

const CartProduct: React.FC<CartProductProps> = ({ cartItem }) => {
    const { product, quantity } = cartItem;
    const { removeFromCart, updateQuantity } = useCart();

    const handleRemoveFromCart = async () => {
        await removeFromCart(cartItem.id);
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        updateQuantity(cartItem.id, product.id, newQuantity);
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'row', padding: 2, margin: 2 }}>
            <Box
                sx={{
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    borderRadius: '8px',
                }}
            >
                <CardMedia
                    component="img"
                    width="100%"
                    height="auto"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ borderRadius: '8px' }}
                />
            </Box>
            <Box sx={{ flexGrow: 1, paddingLeft: '8px' }}>
                <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                </CardContent>
                <CardActions>
                    <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 1, marginBottom: 1 }}>
                            <Button
                                onClick={() => handleUpdateQuantity(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                <RemoveIcon />
                            </Button>
                            <Typography sx={{ margin: "0 8px" }}>{quantity}</Typography>
                            <Button onClick={() => handleUpdateQuantity(quantity + 1)}>
                                <AddIcon />
                            </Button>
                        </Box>
                        <Button
                            startIcon={<RemoveShoppingCartIcon />}
                            onClick={handleRemoveFromCart}
                            variant="contained"
                            sx={{ backgroundColor: "red" }}
                        >
                            Remove from Cart
                        </Button>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    );
};

export default CartProduct;