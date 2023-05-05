import React from "react";
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography
} from "@mui/material";
import { 
    Link,
    NavLink
} from "react-router-dom";
import '../App.css';

const NavBar = () => {
  return (
    <AppBar position="static">
        <CssBaseline />
        <Toolbar>
            <Link to="/" className="logo">
                <Typography variant="h4" className="logo">
                    Dart
                </Typography>
            </Link>

            <div className="navlinks">
                <NavLink to="/create-game" className="link">
                    Create Game
                </NavLink>
                <NavLink to="/players" className="link">
                    Players
                </NavLink>
                <NavLink to="/players-statistics" className="link">
                    Players Statistics
                </NavLink>
            </div>
        </Toolbar>
    </AppBar>
  );
}

export default NavBar;