import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { decodeJwt, JwtPayload } from "../../utils/jwtHelper";
import Logout from "./Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Profile from "../Profile/Profile";
import { useCart } from "../../contexts/CartContext";
import { Badge } from "@mui/material";


const Header: React.FC = () => {
    const [username, setUsername] = useState("");
    const accessToken = localStorage.getItem("access_token");
    const isLoggedIn = !!accessToken;
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems } = useCart();

    const handleUsernameClick = () => {
        navigate("/profile");
    };

    useEffect(() => {
        if (accessToken) {
            const decodedToken = decodeJwt(accessToken);
            if (decodedToken) {
                setUsername(decodedToken.username);
            }
        }
    }, [accessToken]);

    return (
        <Box>
            <AppBar position="static" key={accessToken || location.key}>
                <Toolbar>
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                        <Typography variant="h6" component="div" >
                            GPT Online Shop
                        </Typography>
                    </RouterLink>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {!isLoggedIn && (
                            <>
                                <Button component={RouterLink} to="/register" color="inherit">
                                    Register
                                </Button>
                                <Button component={RouterLink} to="/login" color="inherit">
                                    Log in
                                </Button>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <Button color="inherit" onClick={handleUsernameClick}>
                                    {username}
                                </Button>
                                <Button component={RouterLink} to="/cart" color="inherit">
                                    <Badge badgeContent={cartItems.length} color="error">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </Button>
                                <Logout />
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
