import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link as MUILink,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const res = await fetch("/api/profile/photo", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.photo) {
          setProfilePhoto(`/uploads/${data.photo}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchProfilePhoto();
    }
  }, [user]);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{ backgroundColor: "#000", height: "80px", justifyContent: "center" }}
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
              fontFamily: "'Dancing Script', cursive",
              color: "#fff",
              fontStyle: "italic",
              letterSpacing: "1px",
            }}
          >
            Travel Blogger
          </MUILink>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <IconButton onClick={handleAvatarClick} size="small">
                  <Avatar
                    src={profilePhoto || undefined}
                    sx={{
                      bgcolor: profilePhoto ? "transparent" : "#fff",
                      color: "#000",
                      width: 36,
                      height: 36,
                      fontWeight: "bold",
                    }}
                  >
                    {!profilePhoto && user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
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
