const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/*
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
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);*/

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

      /*type: String,
      required: true,*/
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Reference to User model

      required: true,
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    comments: [
      {
        user: { type: String },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
        replies: [
          {
            user: { type: String },
            text: { type: String },
            createdAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    likes: [
      {
        user: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
