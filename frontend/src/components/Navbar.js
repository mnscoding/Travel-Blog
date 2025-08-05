/*
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Travel Blogger</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;*/

/*06.24
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link as MUILink,
  Avatar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        backgroundColor: "#000", // solid black
        height: "80px",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 4,
            minHeight: "80px !important",
          }}
        >
          
          <MUILink
            component={RouterLink}
            to="/"
            underline="none"
            sx={{
              fontWeight: "bold",
              fontSize: "2.2rem",
              fontFamily: "'Dancing Script', cursive", // font change
              color: "#fff",
              fontStyle: "italic", // ensure italic style
              letterSpacing: "1px",
            }}
          >
            Travel Blogger
          </MUILink>

          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <Avatar
                  sx={{ bgcolor: "#fff", color: "#000", width: 36, height: 36 }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{ color: "#ddd", fontWeight: 500 }}
                >
                  {user.email}
                </Typography>
                <Button
                  onClick={handleClick}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: "#FFD700", // golden yellow
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#e6c200", // darker gold on hover
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textTransform: "none",
                    color: "#ccc",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    textTransform: "none",
                    color: "#ccc",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;*/

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link as MUILink,
  Avatar,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleClick = () => {
    logout();
  };

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        backgroundColor: "#000",
        height: "80px",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: 4,
            minHeight: "80px !important",
          }}
        >
          {/* Left - Site Title */}
          <MUILink
            component={RouterLink}
            to="/"
            underline="none"
            sx={{
              fontWeight: "bold",
              fontSize: "2.2rem",
              fontFamily: "'Dancing Script', cursive",
              color: "#fff",
              fontStyle: "italic",
              letterSpacing: "1px",
            }}
          >
            Travel Blogger
          </MUILink>

          {/* Right - Auth/User Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <Avatar
                  sx={{ bgcolor: "#fff", color: "#000", width: 36, height: 36 }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{ color: "#ddd", fontWeight: 500 }}
                >
                  {user.email}
                </Typography>
                <Button
                  onClick={handleClick}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: "#FFD700",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#e6c200",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontWeight: currentPath === "/login" ? "bold" : "normal",
                    borderBottom:
                      currentPath === "/login" ? "2px solid #FFD700" : "none",
                    borderRadius: 0,
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontWeight: currentPath === "/signup" ? "bold" : "normal",
                    borderBottom:
                      currentPath === "/signup" ? "2px solid #FFD700" : "none",
                    borderRadius: 0,
                    "&:hover": { color: "#fff" },
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
