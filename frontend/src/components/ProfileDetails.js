/*
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProfilesContext } from "../hooks/useProfileContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const ProfileForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useProfilesContext();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:4000/api/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setDob(data.dob ? data.dob.split("T")[0] : "");
          setCity(data.city || "");
          setBio(data.bio || "");
          setPhotoPreview(
            data.photo ? `http://localhost:4000/uploads/${data.photo}` : ""
          );
          setIsEditing(true);
          dispatch({ type: "SET_PROFILE", payload: data });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("city", city);
    formData.append("bio", bio);
    if (photo) formData.append("photo", photo);

    try {
      const url = "http://localhost:4000/api/profile";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        setError(null);
        setEmptyFields([]);
        dispatch({ type: "SET_PROFILE", payload: json });
        alert(isEditing ? "Profile updated" : "Profile created");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong");
    }
  };

  const handlePhotoChange = (file) => {
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              src={photoPreview}
              alt="Profile Photo"
              sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
            />
            <label htmlFor="upload-photo">
              <input
                style={{ display: "none" }}
                id="upload-photo"
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files[0])}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body2" color="text.secondary">
              Click camera icon to change photo
            </Typography>
          </Grid>

         
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {isEditing ? "Update Your Profile" : "Create Your Profile"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  variant="standard"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={emptyFields.includes("name")}
                  fullWidth
                />
                <TextField
                  variant="standard"
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  error={emptyFields.includes("dob")}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  variant="standard"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={emptyFields.includes("city")}
                  fullWidth
                />
                <TextField
                  variant="standard"
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  error={emptyFields.includes("bio")}
                  fullWidth
                  multiline
                  rows={3}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ borderRadius: 2, mt: 2 }}
                >
                  {isEditing ? "Update Profile" : "Create Profile"}
                </Button>
              </Stack>
            </Box>

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileForm;*/

import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProfilesContext } from "../hooks/useProfileContext";
import { useLogout } from "../hooks/useLogout";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Stack,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { PhotoCamera, MoreVert, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useProfilesContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteOption, setDeleteOption] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:4000/api/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setDob(data.dob ? data.dob.split("T")[0] : "");
          setCity(data.city || "");
          setBio(data.bio || "");
          setPhotoPreview(
            data.photo ? `http://localhost:4000/uploads/${data.photo}` : ""
          );
          setIsEditing(true);
          dispatch({ type: "SET_PROFILE", payload: data });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("city", city);
    formData.append("bio", bio);
    if (photo) formData.append("photo", photo);

    try {
      const url = "http://localhost:4000/api/profile";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        setError(null);
        setEmptyFields([]);
        dispatch({ type: "SET_PROFILE", payload: json });
        setSnackbar({
          open: true,
          message: isEditing
            ? "Profile updated successfully"
            : "Profile created successfully",
          severity: "success",
        });
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong");
    }
  };

  const handlePhotoChange = (file) => {
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDeleteOption = async () => {
    try {
      if (deleteOption === "profile") {
        // Delete only profile
        const response = await fetch("http://localhost:4000/api/profile", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.ok) {
          setName("");
          setDob("");
          setCity("");
          setBio("");
          setPhotoPreview("");
          setPhoto(null);
          setIsEditing(false);
          dispatch({ type: "DELETE_PROFILE" });
          setSnackbar({
            open: true,
            message: "Profile deleted successfully",
            severity: "success",
          });
        } else {
          const error = await response.json();
          setError(error.error);
          setSnackbar({ open: true, message: error.error, severity: "error" });
        }
      } else if (deleteOption === "account") {
        // Delete account and profile
        const response = await fetch("http://localhost:4000/api/user", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.ok) {
          setSnackbar({
            open: true,
            message: "Account deleted successfully",
            severity: "success",
          });
          setTimeout(() => {
            logout();
            navigate("/login");
          }, 1500);
        } else {
          const error = await response.json();
          setError(error.error);
          setSnackbar({ open: true, message: error.error, severity: "error" });
        }
      }
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Something went wrong");
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAnchorEl(null);
    }
  };

  const openDeleteDialog = (option) => {
    setDeleteOption(option);
    setDeleteDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          position: "relative",
        }}
      >
        {/* Delete Menu Button - always visible */}
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {isEditing && (
            <MenuItem onClick={() => openDeleteDialog("profile")}>
              <Delete sx={{ mr: 1 }} /> Delete Profile Only
            </MenuItem>
          )}
          <MenuItem onClick={() => openDeleteDialog("account")}>
            <Delete sx={{ mr: 1 }} />{" "}
            {isEditing ? "Delete Account & Profile" : "Delete Account"}
          </MenuItem>
        </Menu>

        <Grid container spacing={4} alignItems="center">
          {/* LEFT SIDE - PHOTO */}
          <Grid item xs={12} md={4} textAlign="center">
            <Avatar
              src={photoPreview}
              alt="Profile Photo"
              sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
            />
            <label htmlFor="upload-photo">
              <input
                style={{ display: "none" }}
                id="upload-photo"
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files[0])}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body2" color="text.secondary">
              Click camera icon to change photo
            </Typography>
          </Grid>

          {/* RIGHT SIDE - FORM */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {isEditing ? "Update Your Profile" : "Create Your Profile"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  variant="standard"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={emptyFields.includes("name")}
                  fullWidth
                />
                <TextField
                  variant="standard"
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  error={emptyFields.includes("dob")}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  variant="standard"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={emptyFields.includes("city")}
                  fullWidth
                />
                <TextField
                  variant="standard"
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  error={emptyFields.includes("bio")}
                  fullWidth
                  multiline
                  rows={3}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ borderRadius: 2, mt: 2 }}
                >
                  {isEditing ? "Update Profile" : "Create Profile"}
                </Button>
              </Stack>
            </Box>

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteOption === "profile"
              ? "Are you sure you want to delete your profile? This action cannot be undone."
              : "Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteOption}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileForm;
