const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    city: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "", // Default empty string or you can add a default avatar URL
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("profile", profileSchema);
