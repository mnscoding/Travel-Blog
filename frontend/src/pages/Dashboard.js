import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Modal,
  Chip,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PublicIcon from "@mui/icons-material/Public";
import PlaceIcon from "@mui/icons-material/Place";

// Tab Panel Component
const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box sx={{ mt: 2 }}>{children}</Box> : null;
};

const Dashboard = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null); // For modal
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxWidth: 600,
    width: "90%",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [statsRes, usersRes, profilesRes, postsRes, destinationsRes] =
          await Promise.all([
            axios.get("/api/admin/dashboard", { headers }),
            axios.get("/api/admin/users", { headers }),
            axios.get("/api/admin/profiles", { headers }),
            axios.get("/api/admin/posts", { headers }),
            axios.get("/api/admin/destinations", { headers }),
          ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setProfiles(profilesRes.data);
        setPosts(postsRes.data);
        setDestinations(destinationsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  if (!stats) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PeopleIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonIcon sx={{ fontSize: 50, color: "#9c27b0" }} />
            <Typography variant="h6">Total Profiles</Typography>
            <Typography variant="h4">{stats.totalProfiles}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PostAddIcon sx={{ fontSize: 50, color: "#ff9800" }} />
            <Typography variant="h6">Total Posts</Typography>
            <Typography variant="h4">{stats.totalPosts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PublicIcon sx={{ fontSize: 50, color: "#4caf50" }} />
            <Typography variant="h6">Public Posts</Typography>
            <Typography variant="h4">{stats.publicPosts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PlaceIcon sx={{ fontSize: 50, color: "#f44336" }} />
            <Typography variant="h6">Total Destinations</Typography>
            <Typography variant="h4">{stats.totalDestinations}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} centered>
          <Tab label="Users" />
          <Tab label="Profiles" />
          <Tab label="Posts" />
          <Tab label="Destinations" />
        </Tabs>
      </Paper>

      {/* Users Tab */}
      <TabPanel value={tabIndex} index={0}>
        <TableContainer
          component={Paper}
          sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u._id}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Profiles Tab */}
      <TabPanel value={tabIndex} index={1}>
        <TableContainer
          component={Paper}
          sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Bio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((p) => {
                const userEmail =
                  users.find((u) => u._id === p.user_id)?.email || "";
                return (
                  <TableRow
                    key={p._id}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <TableCell>{userEmail}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.city}</TableCell>
                    <TableCell>{p.bio}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Posts Tab */}
      <TabPanel value={tabIndex} index={2}>
        <TableContainer
          component={Paper}
          sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((p) => {
                const authorEmail = (() => {
                  if (!p.user_id) return "Unknown"; // null or missing
                  if (typeof p.user_id === "string") {
                    // old post, lookup in users array
                    const user = users.find(
                      (u) => u._id.toString() === p.user_id.toString()
                    );
                    return user?.email || "Unknown";
                  }
                  // new post, populated user object
                  return p.user_id.email || "Unknown";
                })();

                return (
                  <TableRow
                    key={p._id}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <TableCell>{p.location}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{authorEmail}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedPost(p)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Post Details Modal */}
        {/* Post Details Modal */}
        <Modal
          open={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          aria-labelledby="post-modal-title"
          aria-describedby="post-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "90%",
              maxWidth: 600,
              maxHeight: "90vh", // modal won't exceed 90% of viewport height
              overflowY: "auto", // allow scrolling if content is too tall
            }}
          >
            {selectedPost && (
              <>
                <Typography id="post-modal-title" variant="h6" gutterBottom>
                  {selectedPost.location}
                </Typography>

                <Box
                  sx={{
                    maxHeight: 150, // fixed height for description
                    overflowY: "auto", // scroll if content exceeds height
                    mb: 2,
                  }}
                >
                  <Typography id="post-modal-description">
                    {selectedPost.description}
                  </Typography>
                </Box>

                {selectedPost.photo && (
                  <Box
                    component="img"
                    src={`http://localhost:4000/uploads/${selectedPost.photo}`}
                    alt="Post"
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      maxHeight: 300,
                      objectFit: "cover",
                      mb: 2,
                    }}
                  />
                )}

                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedPost(null)}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </TabPanel>
      {/* Destinations Tab - Add this new tab panel */}
      <TabPanel value={tabIndex} index={3}>
        <TableContainer
          component={Paper}
          sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {destinations.map((d) => {
                const authorEmail = (() => {
                  if (!d.user_id) return "Unknown";
                  if (typeof d.user_id === "string") {
                    const user = users.find(
                      (u) => u._id.toString() === d.user_id.toString()
                    );
                    return user?.email || "Unknown";
                  }
                  return d.user_id.email || "Unknown";
                })();

                return (
                  <TableRow
                    key={d._id}
                    sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                  >
                    <TableCell>{d.title}</TableCell>
                    <TableCell>{d.location}</TableCell>
                    <TableCell>
                      <Chip label={d.category} size="small" />
                    </TableCell>
                    <TableCell>{d.country}</TableCell>
                    <TableCell>{authorEmail}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedDestination(d)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Destination Details Modal */}
        <Modal
          open={!!selectedDestination}
          onClose={() => setSelectedDestination(null)}
          aria-labelledby="destination-modal-title"
          aria-describedby="destination-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "90%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {selectedDestination && (
              <>
                <Typography
                  id="destination-modal-title"
                  variant="h6"
                  gutterBottom
                >
                  {selectedDestination.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {selectedDestination.location},{" "}
                  {selectedDestination.country}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {selectedDestination.category}
                </Typography>

                {selectedDestination.bestTimeToVisit && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Best Time to Visit: {selectedDestination.bestTimeToVisit}
                  </Typography>
                )}

                {selectedDestination.estimatedCost && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Estimated Cost: {selectedDestination.estimatedCost}
                  </Typography>
                )}

                <Box
                  sx={{
                    maxHeight: 150,
                    overflowY: "auto",
                    mb: 2,
                    mt: 2,
                  }}
                >
                  <Typography id="destination-modal-description">
                    {selectedDestination.description}
                  </Typography>
                </Box>

                {selectedDestination.tags &&
                  selectedDestination.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Tags:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selectedDestination.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}

                {selectedDestination.photos &&
                  selectedDestination.photos.length > 0 && (
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Photos:
                      </Typography>
                      {selectedDestination.photos.map((photo, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={`http://localhost:4000/uploads/destinations/${photo}`}
                          alt={`Destination ${index + 1}`}
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                            maxHeight: 300,
                            objectFit: "cover",
                            mb: 2,
                          }}
                        />
                      ))}
                    </Box>
                  )}

                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedDestination(null)}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
