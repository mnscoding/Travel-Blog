require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const cors = require("cors");
//express app
const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));

//middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening to port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

process.env;
