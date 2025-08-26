import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import img1 from "../images/travel2.jpg";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password); // ✅ no role passed
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${img1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: 4,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <form className="signup" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Password */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            mt: 2,
            width: "100%",
            bgcolor: "black",
            "&:hover": {
              backgroundColor: "grey",
              transform: "scale(1.01)",
            },
          }}
        >
          Sign Up
        </Button>

        {error && <div className="error">{error}</div>}
      </form>
    </Box>
  );
};

export default Signup;
