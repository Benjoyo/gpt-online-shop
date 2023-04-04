import { useParams } from "react-router-dom";
import { Product as ProductType } from "../../types/product";
import { getProductById } from "../../services/productService";
import React, { useState, useEffect } from "react";
import { Button, Card, CardActions, CardMedia } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { useCart } from "../../contexts/CartContext";
import { Box } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export interface ProductParams {
    [key: string]: string | undefined;
}

export const Product: React.FC = () => {
    const { productId } = useParams<ProductParams>();
    const [product, setProduct] = useState<ProductType | null>(null);
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await getProductById(parseInt(productId!!));
            setProduct(productData);
        };

        fetchProduct();
    }, [productId]);


    const isInCart = (productId: number) => {
        return cartItems.some((item) => item.product.id === productId);
    };

    const handleAddToCart = async (productId: number) => {
        await addToCart(productId, 1);
    };

    const handleRemoveFromCart = async (productId: number) => {
        const cartItem = cartItems.find((item) => item.product.id === productId);
        if (cartItem) {
            await removeFromCart(cartItem.id);
        }
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        const cartItem = cartItems.find((item) => item.product.id === productId);
        if (!cartItem) return;
        updateQuantity(cartItem.id, productId, newQuantity);
    };

    const getQuantityInCart = (productId: string | undefined): number => {
        if (!productId) return 0;
        const cartItem = cartItems.find((item) => item.product.id === parseInt(productId));
        return cartItem ? cartItem.quantity : 0;
    };

    const quantity = getQuantityInCart(productId);

    return (
        product && (
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: 4 }}>
                <Box
                    sx={{
                        width: '250px',
                        height: '250px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        borderRadius: '16px',
                    }}
                >
                    <CardMedia
                        component="img"
                        width="100%"
                        height="auto"
                        image={product.imageUrl}
                        alt={product.name}
                        sx={{ borderRadius: '16px' }}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, paddingLeft: '16px' }}>
                    <CardContent>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography variant="body1">{product.description}</Typography>
                        <Typography variant="h6">${product.price.toFixed(2)}</Typography>
                    </CardContent>
                    <CardActions>
                        {isInCart(product.id) ? (
                            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 1, marginBottom: 1 }}>
                                    <Button
                                        onClick={() => handleUpdateQuantity(product.id, quantity - 1)}
                                        disabled={quantity <= 1}
                                    >
                                        <RemoveIcon />
                                    </Button>
                                    <Typography sx={{ margin: "0 8px" }}>{quantity}</Typography>
                                    <Button onClick={() => handleUpdateQuantity(product.id, quantity + 1)}>
                                        <AddIcon />
                                    </Button>
                                </Box>
                                <Button
                                    startIcon={<RemoveShoppingCartIcon />}
                                    onClick={() => handleRemoveFromCart(product.id)}
                                    variant="contained"
                                    sx={{ backgroundColor: "red" }}
                                >
                                    Remove from Cart
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                startIcon={<AddShoppingCartIcon />}
                                onClick={() => handleAddToCart(product.id)}
                                variant="contained"
                                color="primary"
                            >
                                Add to Cart
                            </Button>
                        )}



                    </CardActions>

                </Box>
            </Card>
        )
    );
};

export default Product;