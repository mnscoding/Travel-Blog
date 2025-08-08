import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "../components/ProfileDetails";
import { Padding } from "@mui/icons-material";

const Profile = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div>
      <Button
        onClick={handleBack}
        color="white"
        sx={{
          color: "black",
          "&:hover": { backgroundColor: "lightgrey" },
          fontSize: "15px",
        }}
      >
        Travel Posts
      </Button>
      <ProfileDetails />
    </div>
  );
};

export default Profile;
