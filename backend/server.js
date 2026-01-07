const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const adminAuth = require("./middleware/adminAuth");
const protectAdmin = adminAuth();

app.use(express.json());
require("./models/Thought");
require("./models/Quote");

app.get("/admin.html", protectAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
  });
  
  app.get("/admin.js", protectAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.js"));
  });

// ✅ Serve frontend correctly
app.use(express.static(path.join(__dirname, "public")));
// ✅ Protect admin page + admin script

  

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 💾"))
  .catch((err) => console.log(err));

// Request logger (optional, fine to keep)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// API routes
const thoughtsRoute = require("./routes/thoughts");
app.use("/api/thoughts", thoughtsRoute);
const quotesRoute = require("./routes/quotes");
app.use("/api/quotes", quotesRoute);


// ❌ REMOVE the old app.get("/")

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
