/*
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import DestinationForm from "../components/DestinationForm";
import DestinationCard from "../components/DestinationCard";
import { useAuthContext } from "../hooks/useAuthContext";

const Destination = () => {
  const { user } = useAuthContext();
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    country: "all",
    sortBy: "newest",
    search: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchDestinations();
    fetchFilters();
  }, [filters]);

  const fetchDestinations = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category !== "all")
        params.append("category", filters.category);
      if (filters.country !== "all") params.append("country", filters.country);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/destinations?${params}`);
      const data = await response.json();

      if (response.ok) {
        setDestinations(data);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [categoriesRes, countriesRes] = await Promise.all([
        fetch("/api/destinations/categories"),
        fetch("/api/destinations/countries"),
      ]);

      const categoriesData = await categoriesRes.json();
      const countriesData = await countriesRes.json();

      if (categoriesRes.ok) setCategories(categoriesData);
      if (countriesRes.ok) setCountries(countriesData);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const handleLike = async (destinationId) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/destinations/${destinationId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setDestinations((prev) =>
          prev.map((dest) =>
            dest._id === destinationId ? { ...dest, likes: data.likes } : dest
          )
        );
      }
    } catch (error) {
      console.error("Error liking destination:", error);
    }
  };

  const handleDestinationCreated = (newDestination) => {
    setDestinations((prev) => [newDestination, ...prev]);
    setActiveTab(0); // Switch to browse tab
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      country: "all",
      sortBy: "newest",
      search: "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        Recommended Destinations
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="Browse Destinations" />
        <Tab label="Recommend a Destination" disabled={!user} />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Country"
                  value={filters.country}
                  onChange={(e) =>
                    handleFilterChange("country", e.target.value)
                  }
                >
                  <MenuItem value="all">All Countries</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Sort By"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="mostLiked">Most Liked</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search destinations..."
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{ height: "56px" }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {destinations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No destinations found. Be the first to recommend one!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {destinations.map((destination) => (
                <Grid item key={destination._id} xs={12} sm={6} md={4} lg={3}>
                  <DestinationCard
                    destination={destination}
                    onLike={handleLike}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <DestinationForm onDestinationCreated={handleDestinationCreated} />
      )}
    </Container>
  );
};

export default Destination;*/

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import DestinationForm from "../components/DestinationForm";
import DestinationCard from "../components/DestinationCard";
import { useAuthContext } from "../hooks/useAuthContext";

const Destination = () => {
  const { user } = useAuthContext();
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    country: "all",
    sortBy: "newest",
    search: "",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [editingDestination, setEditingDestination] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDestinations();
    fetchFilters();
  }, [filters]);

  const fetchDestinations = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category !== "all")
        params.append("category", filters.category);
      if (filters.country !== "all") params.append("country", filters.country);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/destinations?${params}`);
      const data = await response.json();

      if (response.ok) {
        setDestinations(data);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [categoriesRes, countriesRes] = await Promise.all([
        fetch("/api/destinations/categories"),
        fetch("/api/destinations/countries"),
      ]);

      const categoriesData = await categoriesRes.json();
      const countriesData = await countriesRes.json();

      if (categoriesRes.ok) setCategories(categoriesData);
      if (countriesRes.ok) setCountries(countriesData);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const handleLike = async (destinationId) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/destinations/${destinationId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setDestinations((prev) =>
          prev.map((dest) =>
            dest._id === destinationId ? { ...dest, likes: data.likes } : dest
          )
        );
      }
    } catch (error) {
      console.error("Error liking destination:", error);
    }
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingDestination(null);
  };

  const handleDestinationUpdated = (updatedDestination) => {
    setDestinations((prev) =>
      prev.map((dest) =>
        dest._id === updatedDestination._id ? updatedDestination : dest
      )
    );
    handleEditClose();
  };

  const handleDelete = async (destinationId) => {
    if (!user) return;

    if (!window.confirm("Are you sure you want to delete this destination?")) {
      return;
    }

    try {
      const response = await fetch(`/api/destinations/${destinationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        // Remove the destination from the list
        setDestinations((prev) =>
          prev.filter((dest) => dest._id !== destinationId)
        );
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete destination");
      }
    } catch (error) {
      console.error("Error deleting destination:", error);
      alert("Error deleting destination");
    }
  };

  const handleDestinationCreated = (newDestination) => {
    setDestinations((prev) => [newDestination, ...prev]);
    setActiveTab(0); // Switch to browse tab
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      country: "all",
      sortBy: "newest",
      search: "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        Recommended Destinations
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="Browse Destinations" />
        <Tab label="Recommend a Destination" disabled={!user} />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Country"
                  value={filters.country}
                  onChange={(e) =>
                    handleFilterChange("country", e.target.value)
                  }
                >
                  <MenuItem value="all">All Countries</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Sort By"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="mostLiked">Most Liked</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search destinations..."
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{ height: "56px" }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {destinations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No destinations found. Be the first to recommend one!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {destinations.map((destination) => (
                <Grid item key={destination._id} xs={12} sm={6} md={4} lg={3}>
                  <DestinationCard
                    destination={destination}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <DestinationForm onDestinationCreated={handleDestinationCreated} />
      )}

      <Dialog
        open={isEditModalOpen}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Destination</DialogTitle>
        <DialogContent>
          <DestinationForm
            editingDestination={editingDestination}
            onDestinationCreated={handleDestinationUpdated}
            onCancel={handleEditClose}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Destination;
