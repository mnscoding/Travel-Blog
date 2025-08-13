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
    </Container>
  );
};

export default ProfileForm;

/*08.10
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProfilesContext } from "../hooks/useProfileContext";

const ProfileForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useProfilesContext(); // NEW: context usage

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

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
      const response = await fetch("http://localhost:4000/api/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        // Clear form
        setName("");
        setDob("");
        setCity("");
        setBio("");
        setPhoto(null);
        setError(null);
        setEmptyFields([]);

        // Update context
        dispatch({ type: "SET_PROFILE", payload: json }); // NEW

        alert("Profile created successfully");
        console.log(json);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Create Profile</h3>

      <label>Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Date of Birth:</label>
      <input
        type="date"
        onChange={(e) => setDob(e.target.value)}
        value={dob}
        className={emptyFields.includes("dob") ? "error" : ""}
      />

      <label>City:</label>
      <input
        type="text"
        onChange={(e) => setCity(e.target.value)}
        value={city}
        className={emptyFields.includes("city") ? "error" : ""}
      />

      <label>Bio:</label>
      <textarea
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        className={emptyFields.includes("bio") ? "error" : ""}
      />

      <label>Photo:</label>
      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

      <button>Create Profile</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ProfileForm;*/

/*import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { Edit, Cancel, Save, CameraAlt } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    bio: "",
    photo: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("/api/profile/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          city: data.city || "",
          bio: data.bio || "",
          photo: null,
        });

        setPreviewImage(data.photo ? data.photo : null);
      } catch (err) {
        console.error(err);
        setError("Could not fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Handle input
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name || "",
      city: profile.city || "",
      bio: profile.bio || "",
      photo: null,
    });
    setPreviewImage(profile.photo || null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("bio", formData.bio);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const res = await fetch(`/api/profile/${profile._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      setProfile(data);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Alert severity="warning">No profile found for this user.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Your Profile</Typography>
          {!isEditing ? (
            <Button
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              variant="contained"
            >
              Edit
            </Button>
          ) : (
            <Button
              startIcon={<Cancel />}
              onClick={handleCancel}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
          )}
        </Box>

        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={previewImage || undefined}
                sx={{
                  width: 140,
                  height: 140,
                  mb: 2,
                  bgcolor: previewImage ? "transparent" : "primary.main",
                }}
              >
                {!previewImage && profile.name.charAt(0).toUpperCase()}
              </Avatar>

              {isEditing && (
                <>
                  <label htmlFor="profile-photo">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CameraAlt />}
                    >
                      Change Photo
                    </Button>
                    <VisuallyHiddenInput
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </>
              )}
              <Typography variant="body2" mt={1}>
                {profile.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                />
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={!isEditing}
                />
                <TextField
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  disabled={!isEditing}
                />

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                {isEditing && (
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={saving}
                      startIcon={
                        saving ? <CircularProgress size={20} /> : <Save />
                      }
                    >
                      Save
                    </Button>
                  </Box>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;*/
