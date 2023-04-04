import React from "react";
import { Route, Routes } from "react-router-dom";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import CompletePurchase from "./components/Checkout/CompletePurchase";
import CreditCard from "./components/Checkout/CreditCard";
import ShippingAddress from "./components/Checkout/ShippingAddress";
import Login from "./components/Header/Login";
import Register from "./components/Header/Register";
import OrderAdmin from "./components/Order/OrderAdmin";
import OrderHistory from "./components/Order/OrderHistory";
import { Product } from "./components/Product/Product";
import ProductList from "./components/Product/ProductList";
import Profile from "./components/Profile/Profile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products/:productId" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/shipping-address" element={<ShippingAddress />} />
      <Route path="/payment" element={<CreditCard />} />
      <Route path="/summary" element={<CompletePurchase />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/admin" element={<OrderAdmin />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
