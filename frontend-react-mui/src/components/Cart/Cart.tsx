import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCart } from '../../contexts/CartContext';
import CartProduct from './CartProduct';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';


const Cart: React.FC = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    return (
        <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "750px",
          margin: "0 auto",
          padding: 2,
          marginTop: 3,
        }}
      >
        <Typography variant="h4" component="div">
          Your Cart
        </Typography>
        {cartItems.length > 0 && (
          <Button
            startIcon={<ArrowForwardIcon />}
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </Button>
        )}
      </Box>
      <Box
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "750px",
          margin: "0 auto",
        }}
      >
        {cartItems.length === 0 ? (
          <Typography variant="body1" sx={{ paddingLeft: 2 }}>
            Your cart is empty.
          </Typography>
        ) : (
          cartItems.map((item) => (
            <CartProduct key={item.product.id} cartItem={item} />
          ))
        )}
      </Box>
    </Box>
    );
};

export default Cart;