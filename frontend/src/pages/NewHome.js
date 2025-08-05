import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import PostDetails from "../components/PostDetails";

const NewHome = () => {
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const response = await fetch("/api/posts/public");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching posts:", data.error || data);
          setLoading(false);
          return;
        }

        setPublicPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
        Public Travel Posts
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : publicPosts.length === 0 ? (
        <Typography textAlign="center" sx={{ mt: 3 }}>
          No public posts available.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {publicPosts.map((post) => (
            <PostDetails key={post._id} post={post} hideStatusToggle={true} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default NewHome;
