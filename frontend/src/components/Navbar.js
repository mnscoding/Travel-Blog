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

/*08.13
import React, { useState } from "react";
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

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile"); // update to your actual profile route
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
                    sx={{
                      bgcolor: "#fff",
                      color: "#000",
                      width: 36,
                      height: 36,
                      fontWeight: "bold",
                    }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
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

export default Navbar;*/

/*08.07
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

export default Navbar;*/

/*import React, { useState } from "react";
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
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  AccountCircle,
  ExitToApp,
  Person,
  Settings,
} from "@mui/icons-material";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  // Construct the proper photo URL
  const getProfilePhotoUrl = () => {
    if (!user?.profile?.photo) return null;
    return user.profile.photo.includes("http")
      ? user.profile.photo
      : `api/uploads/${user.profile.photo}`;
  };

  const profilePhotoUrl = getProfilePhotoUrl();

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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  <Avatar
                    sx={{
                      bgcolor: profilePhotoUrl ? "transparent" : "#fff",
                      color: "#000",
                      width: 36,
                      height: 36,
                    }}
                    src={profilePhotoUrl || undefined}
                  >
                    {!profilePhotoUrl && user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
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

export default Navbar;*/
