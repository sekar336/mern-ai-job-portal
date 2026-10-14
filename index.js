
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const aiRoutes = require("./routes/aiRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userroutes");
const applicationRoutes = require("./routes/applicationroutes");
const notificationRoutes = require("./routes/notificationroutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Connect database
connectDB();

// Routes
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
app.use("/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to AI Job Portal");
});

// About route
app.get("/about", (req, res) => {
  res.send("About Page");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});