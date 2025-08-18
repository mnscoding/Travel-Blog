/*08.17
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String, // will store the filename or path
    },
    user_id: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Reference to User model

      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);*/

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // NEW: role with default "User"
    role: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
      default: "User",
    },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid.");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough.");
  }

  const exists = await this.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // role will default to "User"
  const user = await this.create({
    email: email.toLowerCase().trim(),
    password: hash,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  // If role was missing on old records, set it to "User" and persist.
  if (!user.role) {
    user.role = "User";
    await user.save();
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
