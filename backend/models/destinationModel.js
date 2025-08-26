const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const destinationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "historical",
        "beach",
        "forest",
        "waterfall",
        "mountain",
        "city",
        "religious",
        "adventure",
        "garden",
      ],
    },
    photos: [
      {
        type: String, // Array of photo filenames
      },
    ],
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        user: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    bestTimeToVisit: {
      type: String,
    },
    estimatedCost: {
      type: String,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
