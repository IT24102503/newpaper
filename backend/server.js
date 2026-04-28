const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB, getDatabaseMode } = require("./config/db");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const itemRoutes = require("./routes/itemRoutes");
app.use("/api/items", itemRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Item Manager API is running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    const storageLabel = getDatabaseMode() === "mongo" ? "MongoDB" : "in-memory storage";
    console.log(`Server running on port ${PORT} using ${storageLabel}`);
  });
};

startServer();
