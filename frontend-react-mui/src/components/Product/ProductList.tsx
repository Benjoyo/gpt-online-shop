// src/components/Product/ProductList.tsx
import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    IconButton,
    Button,
    Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Link } from "react-router-dom";
import { Product as ProductType } from "../../types/product";
import { getProducts } from "../../services/productService";
import { addOrUpdateCartItem, getCartItems, removeCartItem } from "../../services/cartService";
import { useCart } from "../../contexts/CartContext";
import InfiniteScroll from "react-infinite-scroll-component";

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const [initialFetched, setInitialFetched] = useState(false); // Add this line

    const pageSize = 25;

  // Fetch the initial products list (first page)
  useEffect(() => {
    const fetchInitialProducts = async () => {
      const initialProducts = await getProducts(currentPage, pageSize);
      setProducts(initialProducts);
    };

    fetchInitialProducts();
  }, []); // Empty dependency array to fetch initial products only once

  const fetchMoreProducts = async () => {
    const nextPage = currentPage + 1;
    const moreProducts = await getProducts(nextPage, pageSize);
    if (moreProducts.length > 0) {
      setProducts((prevProducts) => [...prevProducts, ...moreProducts]);
      setCurrentPage(nextPage);
    } else {
      setHasMore(false);
    }
  };

    const { cartItems, addToCart, removeFromCart } = useCart();

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

    return (
        <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreProducts}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            <Grid container spacing={4} sx={{ padding: 4 }}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'row', minHeight: '100%' }}>
                            <CardMedia
                                component="img"
                                height="150"
                                image={product.imageUrl}
                                alt={product.name}
                                sx={{ borderRadius: 1, width: '150px' }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <CardContent>
                                    <Typography component={Link} to={`/products/${product.id}`} variant="h6" color="text.primary" sx={{ textDecoration: 'none' }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
                                    <Typography variant="h6" color="text.primary">
                                        ${product.price.toFixed(2)}
                                    </Typography>
                                    {isInCart(product.id) ? (
                                        <Button
                                            startIcon={<RemoveShoppingCartIcon />}
                                            color="primary"
                                            variant="contained"
                                            sx={{ backgroundColor: 'red' }}
                                            onClick={() => handleRemoveFromCart(product.id)}
                                        >
                                            Remove from cart
                                        </Button>
                                    ) : (
                                        <Button
                                            startIcon={<AddShoppingCartIcon />}
                                            color="primary"
                                            variant="contained"
                                            sx={{ backgroundColor: '#1976d2' }}
                                            onClick={() => handleAddToCart(product.id)}>
                                            Add to cart
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </InfiniteScroll>
    );
};

export default ProductList;
