const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const connectdb = require("./DB");
const cors = require("cors");

connectdb();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/AuthRoute"));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../splid/dist")));

// Catch all non-API routes
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "../splid/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
