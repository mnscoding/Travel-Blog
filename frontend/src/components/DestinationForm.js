/*
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Chip,
  Grid,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAuthContext } from "../hooks/useAuthContext";

const categories = [
  { value: "historical", label: "Historical Places" },
  { value: "beach", label: "Beaches" },
  { value: "forest", label: "Forests" },
  { value: "waterfall", label: "Waterfalls" },
  { value: "mountain", label: "Mountains" },
  { value: "city", label: "Cities" },
  { value: "religious", label: "Religious Sites" },
  { value: "adventure", label: "Adventure Sports" },
];

const DestinationForm = ({ onDestinationCreated, editingDestination }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    title: editingDestination?.title || "",
    description: editingDestination?.description || "",
    country: editingDestination?.country || "",
    location: editingDestination?.location || "",
    category: editingDestination?.category || "",
    bestTimeToVisit: editingDestination?.bestTimeToVisit || "",
    estimatedCost: editingDestination?.estimatedCost || "",
    tags: editingDestination?.tags || [],
  });
  const [photos, setPhotos] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    // Validation
    const requiredFields = [
      "title",
      "description",
      "country",
      "location",
      "category",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          formDataToSend.append(key, formData[key].join(","));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      const endpoint = editingDestination
        ? `/api/destinations/${editingDestination._id}`
        : "/api/destinations";

      const method = editingDestination ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (onDestinationCreated) {
        onDestinationCreated(data);
      }

      // Reset form if not editing
      if (!editingDestination) {
        setFormData({
          title: "",
          description: "",
          country: "",
          location: "",
          category: "",
          bestTimeToVisit: "",
          estimatedCost: "",
          tags: [],
        });
        setPhotos([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {editingDestination ? "Edit Destination" : "Recommend a Destination"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Destination Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Specific Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="e.g., Bali, Indonesia"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Share your experience and why you recommend this destination..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Best Time to Visit"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleInputChange}
              placeholder="e.g., November to March"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Cost"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleInputChange}
              placeholder="e.g., $50-100 per day"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags (comma separated)
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  size="small"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} startIcon={<AddIcon />}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              {photos.length} photo(s) selected (Max 5)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : editingDestination
                ? "Update Destination"
                : "Share Destination"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default DestinationForm;*/

import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Chip,
  Grid,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAuthContext } from "../hooks/useAuthContext";

const categories = [
  { value: "historical", label: "Historical Places" },
  { value: "beach", label: "Beaches" },
  { value: "forest", label: "Forests" },
  { value: "waterfall", label: "Waterfalls" },
  { value: "mountain", label: "Mountains" },
  { value: "city", label: "Cities" },
  { value: "religious", label: "Religious Sites" },
  { value: "adventure", label: "Adventure Sports" },
];

const DestinationForm = ({
  onDestinationCreated,
  editingDestination,
  onCancel,
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    title: editingDestination?.title || "",
    description: editingDestination?.description || "",
    country: editingDestination?.country || "",
    location: editingDestination?.location || "",
    category: editingDestination?.category || "",
    bestTimeToVisit: editingDestination?.bestTimeToVisit || "",
    estimatedCost: editingDestination?.estimatedCost || "",
    tags: editingDestination?.tags || [],
  });
  const [photos, setPhotos] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    // Validation
    const requiredFields = [
      "title",
      "description",
      "country",
      "location",
      "category",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          formDataToSend.append(key, formData[key].join(","));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      const endpoint = editingDestination
        ? `/api/destinations/${editingDestination._id}`
        : "/api/destinations";

      const method = editingDestination ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (onDestinationCreated) {
        onDestinationCreated(data);
      }

      // Reset form if not editing
      if (!editingDestination) {
        setFormData({
          title: "",
          description: "",
          country: "",
          location: "",
          category: "",
          bestTimeToVisit: "",
          estimatedCost: "",
          tags: [],
        });
        setPhotos([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {editingDestination ? "Edit Destination" : "Recommend a Destination"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Destination Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Specific Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="e.g., Bali, Indonesia"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Share your experience and why you recommend this destination..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Best Time to Visit"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleInputChange}
              placeholder="e.g., November to March"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Cost"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleInputChange}
              placeholder="e.g., $50-100 per day"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags (comma separated)
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  size="small"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} startIcon={<AddIcon />}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined" component="label" sx={{ mr: 2 }}>
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              {photos.length} photo(s) selected (Max 5)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editingDestination
                  ? "Update Destination"
                  : "Share Destination"}
              </Button>

              {editingDestination && (
                <Button onClick={onCancel} variant="outlined" size="large">
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default DestinationForm;
