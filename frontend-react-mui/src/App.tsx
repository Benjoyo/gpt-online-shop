import { CssBaseline } from "@mui/material";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header/Header";
import { BillingProvider } from "./contexts/BillingContext";
import { CartProvider } from "./contexts/CartContext";
import Routes from "./Routes";

const App: React.FC = () => {
  return (
    <BillingProvider>
      <CartProvider>
        <Router>
          <CssBaseline />
          <Header />
          <main>
            <Routes />
          </main>
        </Router>
      </CartProvider>
    </BillingProvider>
  );
};

export default App;
