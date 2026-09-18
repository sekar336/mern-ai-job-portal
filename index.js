require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const aiRoutes = require("./routes/aiRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// STATIC UPLOADS
// ==========================================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// CONNECT DATABASE
// ==========================================
connectDB();

// ==========================================
// ROUTES
// ==========================================
app.use("/jobs", jobRoutes);

app.use("/users", userRoutes);

app.use("/applications", applicationRoutes);

app.use("/api/ai", aiRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

// ==========================================
// HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.send("Welcome to AI Job Portal");
});

// ==========================================
// ABOUT ROUTE
// ==========================================
app.get("/about", (req, res) => {
  res.send("About Page");
});

// ==========================================
// SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});