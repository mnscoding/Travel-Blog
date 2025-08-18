const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, role: user.role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
/*
//signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    //create a token
    const token = createToken(user._id);

    // Automatically create a profile for the new user

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};*/

const signupUser = async (req, res) => {
  const { email, password } = req.body; // ✅ no role here
  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, role: user.role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
