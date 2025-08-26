/*import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Rating,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Place,
  Share,
  MoreVert,
} from "@mui/icons-material";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const DestinationCard = ({ destination, onLike, onEdit, onDelete }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isLiked =
    user && destination.likes?.some((like) => like.user === user.email);
  const likeCount = destination.likes?.length || 0;

  const handleLike = () => {
    if (!user) {
      alert("Please login to like destinations");
      return;
    }
    onLike(destination._id);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(destination);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(destination._id);
    handleMenuClose();
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % (destination.photos?.length || 1)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (destination.photos?.length || 1)) %
        (destination.photos?.length || 1)
    );
  };

  const handleCardClick = () => {
    navigate(`/destinations/${destination._id}`);
  };

  return (
    <Card
      sx={{
        width: 440,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="250"
          image={`/uploads/destinations/${destination.photos?.[currentImageIndex]}`}
          alt={destination.title}
          onClick={handleCardClick}
          sx={{
            cursor: "pointer",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {destination.photos?.length > 1 && (
          <>
            <IconButton
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ←
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              →
            </IconButton>
          </>
        )}

        <Box sx={{ position: "absolute", top: 8, left: 8 }}>
          <Chip
            label={destination.category}
            color="primary"
            size="small"
            sx={{ color: "white", fontWeight: "bold" }}
          />
        </Box>

        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            sx={{ bgcolor: "rgba(255,255,255,0.8)" }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          onClick={handleCardClick}
          sx={{ cursor: "pointer" }}
        >
          {destination.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Place fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {destination.location}, {destination.country}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {destination.description.length > 100
            ? `${destination.description.substring(0, 100)}...`
            : destination.description}
        </Typography>

        {destination.tags && destination.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {destination.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {destination.bestTimeToVisit && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Best time: {destination.bestTimeToVisit}
          </Typography>
        )}

        {destination.estimatedCost && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Estimated cost: {destination.estimatedCost}
          </Typography>
        )}
      </CardContent>

      <Box
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton onClick={handleLike} size="small">
              {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2">{likeCount}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ width: 24, height: 24, mr: 1 }}
            src={
              destination.user_id?.photo
                ? `/uploads/${destination.user_id.photo}`
                : undefined
            }
          >
            {destination.user_id?.name?.[0] || destination.user_id?.email?.[0]}
          </Avatar>
          <Typography variant="caption">
            {destination.user_id?.name || destination.user_id?.email}
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user?.email === destination.user_id?.email && (
          <>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </>
        )}
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
      </Menu>
    </Card>
  );
};

export default DestinationCard;*/

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Place,
  MoreVert,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useAuthContext } from "../hooks/useAuthContext";

const DestinationCard = ({ destination, onLike, onEdit, onDelete }) => {
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const isLiked =
    user && destination.likes?.some((like) => like.user === user.email);
  const likeCount = destination.likes?.length || 0;

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!destination?.user_id?._id) return;

      try {
        const res = await fetch(`/api/profile/user/${destination.user_id._id}`);
        const data = await res.json();
        if (res.ok && data.photo) {
          setProfilePhoto(data.photo);
        }
      } catch (err) {
        console.log("Error fetching profile photo:", err);
      }
    };

    fetchProfilePhoto();
  }, [destination?.user_id]);

  const handleLike = () => {
    if (!user) {
      alert("Please login to like destinations");
      return;
    }
    onLike(destination._id);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    onEdit(destination);
    handleMenuClose();
  };
  const handleDelete = () => {
    onDelete(destination._id);
    handleMenuClose();
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % (destination.photos?.length || 1)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (destination.photos?.length || 1)) %
        (destination.photos?.length || 1)
    );
  };

  return (
    <Card
      sx={{
        width: 440,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* --- Image --- */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="250"
          image={`/uploads/destinations/${destination.photos?.[currentImageIndex]}`}
          alt={destination.title}
          onClick={() => setOpenImageDialog(true)}
          sx={{
            cursor: "pointer",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {destination.photos?.length > 1 && (
          <>
            <IconButton
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ←
            </IconButton>
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.8)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              →
            </IconButton>
          </>
        )}

        <Box sx={{ position: "absolute", top: 8, left: 8 }}>
          <Chip
            label={destination.category}
            size="small"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          />
        </Box>

        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            sx={{ bgcolor: "rgba(255,255,255,0.8)" }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* --- Content --- */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {destination.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Place fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {destination.location}, {destination.country}
          </Typography>
        </Box>

        {/* Description with inline Read more */}
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ display: "inline" }}
        >
          {showFullDesc ? (
            destination.description
          ) : destination.description.length > 100 ? (
            <>
              {destination.description.substring(0, 100)}
              <span
                onClick={() => setShowFullDesc(true)}
                style={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
              >
                ... Read more
              </span>
            </>
          ) : (
            destination.description
          )}
        </Typography>
        {showFullDesc && destination.description.length > 100 && (
          <span
            onClick={() => setShowFullDesc(false)}
            style={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
          >
            {" "}
            Read less
          </span>
        )}

        {/* Tags */}
        {destination.tags && destination.tags.length > 0 && (
          <Box sx={{ mt: 1, mb: 2 }}>
            {destination.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {destination.bestTimeToVisit && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Best time: {destination.bestTimeToVisit}
          </Typography>
        )}
        {destination.estimatedCost && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Estimated cost: {destination.estimatedCost}
          </Typography>
        )}
      </CardContent>

      {/* --- Bottom Section --- */}
      <Box
        sx={{
          p: 2,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <IconButton onClick={handleLike} size="small">
              {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2">{likeCount}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ width: 24, height: 24, mr: 1 }}
            src={profilePhoto ? `/uploads/${profilePhoto}` : undefined}
          >
            {destination.user_id?.name?.[0] || destination.user_id?.email?.[0]}
          </Avatar>
          <Typography variant="caption">
            {destination.user_id?.name || destination.user_id?.email}
          </Typography>
        </Box>
      </Box>

      {/* --- Full Image Dialog --- */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0, position: "relative", bgcolor: "black" }}>
          <img
            src={`/uploads/destinations/${destination.photos?.[currentImageIndex]}`}
            alt={destination.title}
            style={{ width: "100%", height: "auto" }}
          />

          {/* Navigation Arrows inside dialog */}
          {destination.photos?.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.4)",
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.4)",
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Menu --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user?.email === destination.user_id?.email && (
          <>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </>
        )}
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Report</MenuItem>
      </Menu>
    </Card>
  );
};

export default DestinationCard;
