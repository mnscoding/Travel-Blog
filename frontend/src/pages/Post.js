/*
import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
//components
import PostDetails from "../components/PostDetails";
import PostForm from "../components/PostForm";

const Post = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="posts">
        {posts &&
          posts.map((post) => <PostDetails key={post._id} post={post} />)}
      </div>
      <PostForm />
    </div>
  );
};

export default Post;*/

/*06.23
import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import PostDetails from "../components/PostDetails";
import PostForm from "../components/PostForm";

import {
  Box,
  Grid,
  Fab,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Post = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, position: "relative" }}>
      
      <Grid container spacing={3}>
        {posts &&
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <PostDetails post={post} />
            </Grid>
          ))}
      </Grid>

      
      {user && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsFormOpen(true)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1300,
          }}
        >
          <AddIcon />
        </Fab>
      )}

     
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 400,
            padding: 3,
          },
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add New Post
        </Typography>
        <PostForm onSuccess={() => setIsFormOpen(false)} />
      </Drawer>
    </Box>
  );
};

export default Post;*/

/*06.24
import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import PostDetails from "../components/PostDetails";
import PostForm from "../components/PostForm";

import {
  Box,
  Fab,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Post = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, position: "relative" }}>
      
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, textAlign: "center", mb: 4 }}
      >
        Travel Posts
      </Typography>

      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {posts &&
          posts.map((post) => <PostDetails key={post._id} post={post} />)}
      </Box>

     
      {user && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsFormOpen(true)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1300,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 400,
            padding: 3,
          },
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add New Post
        </Typography>
        <PostForm onSuccess={() => setIsFormOpen(false)} />
      </Drawer>
    </Box>
  );
};

export default Post;*/

import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import PostDetails from "../components/PostDetails";
import PostForm from "../components/PostForm";

import {
  Box,
  Fab,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";

const Post = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, position: "relative" }}>
      {/* Header with Explore Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontWeight: 600,
          }}
        >
          Travel Posts
        </Typography>

        <Button
          component={RouterLink}
          to="/publicpost"
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#555",
            color: "#333",
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          Explore Public Posts
        </Button>
      </Box>

      {/* Blog-style vertical posts list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {posts &&
          posts.map((post) => <PostDetails key={post._id} post={post} />)}
      </Box>

      {/* Floating + Button */}
      {user && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsFormOpen(true)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1300,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Slide-in Drawer Form */}
      <Drawer
        anchor="right"
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 400,
            padding: 3,
          },
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add New Post
        </Typography>
        <PostForm onSuccess={() => setIsFormOpen(false)} />
      </Drawer>
    </Box>
  );
};

export default Post;
