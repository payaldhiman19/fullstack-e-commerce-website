require("dotenv").config(); // must be first, payment.js reads env vars when it loads
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

// Webhook needs the RAW body, so it must come BEFORE express.json()

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Aachoo api is running");
});

app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});