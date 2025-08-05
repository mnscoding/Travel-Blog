import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Stack,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Place,
  Description,
  Send,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

const PostForm = () => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("location", location);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        setLocation("");
        setDescription("");
        setPhoto(null);
        setPhotoPreview(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_POST", payload: json });
      }
    } catch (err) {
      setError("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 600,
        mx: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        Share Your Travel Experience
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        sx={{ mt: 2 }}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={emptyFields.includes("location")}
            helperText={
              emptyFields.includes("location") && "Location is required"
            }
            InputProps={{
              startAdornment: <Place sx={{ color: "action.active", mr: 1 }} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={emptyFields.includes("description")}
            helperText={
              emptyFields.includes("description") && "Description is required"
            }
            InputProps={{
              startAdornment: (
                <Description sx={{ color: "action.active", mr: 1, mt: 1.5 }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add Photo
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AddPhotoAlternate />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                width: "100%",
                height: 120,
                borderStyle: photoPreview ? "none" : "dashed",
              }}
            >
              {photoPreview ? (
                <Box
                  component="img"
                  src={photoPreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              ) : (
                "Select an image"
              )}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<Send />}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {isSubmitting ? "Posting..." : "Share Post"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default PostForm;

/*8.05
import { useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const PostForm = () => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
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
    formData.append("location", location);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo); // key must match backend multer field
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
        // ❌ DON'T set "Content-Type" — browser will set it automatically
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    } else {
      setLocation("");
      setDescription("");
      setPhoto(null);
      setError(null);
      setEmptyFields([]);
      console.log("new post added", json);
      dispatch({ type: "CREATE_POST", payload: json });
    }
  };

  return (
    <form
      className="create"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h3>Add a new post</h3>

      <label>Location:</label>
      <input
        type="text"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        className={emptyFields.includes("location") ? "error" : ""}
      />

      <label>Description:</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes("description") ? "error" : ""}
      />

      <label>Photo:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <button>Add Post</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PostForm;*/
