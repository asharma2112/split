const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connectdb = require("./DB");
const cors = require("cors");

connectdb();

app.use(cors({
  origin: "*",  // allow frontend (we will secure later)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/AuthRoute"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
