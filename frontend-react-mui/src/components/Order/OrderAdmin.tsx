// OrderAdmin.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Order } from "./OrderHistory";
import { getAllOrders, markOrderAsShipped } from "../../services/adminService";

const OrderAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    };

    fetchAllOrders();
  }, []);

  const handleMarkAsShipped = async (orderId: number) => {
    await markOrderAsShipped(orderId);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "SHIPPED" } : order
      )
    );
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
      <Typography variant="h4" component="div" marginBottom={2}>
        All Orders
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
            {order.status === "PENDING" && (
              <Button
                startIcon={<LocalShippingIcon />}
                color="primary"
                variant="contained"
                onClick={() => handleMarkAsShipped(order.id)}
              >
                Mark shipped
              </Button>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default OrderAdmin;
