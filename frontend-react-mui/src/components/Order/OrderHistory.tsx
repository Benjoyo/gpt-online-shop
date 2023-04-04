import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getOrderHistory } from "../../services/orderService";
import { CheckoutItem } from "../Checkout/Checkout";

interface Order {
  id: number;
  userId: number;
  items: CheckoutItem[];
  total: number;
  paymentMethod: {
    id: number;
    cardNumber: string;
    expiryMonth: number;
    expiryYear: number;
  };
  shippingAddress: {
    id: number;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const orderHistory = await getOrderHistory();
      setOrders(orderHistory);
    };

    fetchOrderHistory();
  }, []);

  return (
    <Box
      sx={{
        margin: "0 auto",
        marginTop: 3,
        maxWidth: "750px",
        padding: 2,
      }}
    >
      <Typography variant="h4" component="div" marginBottom={2}>
        Order History
      </Typography>
      {orders.map((order) => (
        <Accordion key={order.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {new Date(order.createdAt).toLocaleDateString()} - ${order.total.toFixed(2)} - {order.status}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {order.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.product.name} (x${item.quantity})`}
                    secondary={`$${(item.product.price * item.quantity).toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default OrderHistory;
