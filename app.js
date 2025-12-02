require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ENV
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI;

// DB Connection
mongoose
  .connect(MONGO)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

// Root
app.get("/", (req, res) => {
  res.send("Helluuu, Serever is ready to rockk. ");
});


const paperRoutes = require('./src/routes/paperRoutes')
const sessionRoutes = require('./src/routes/sessionRoutes')

app.use('/api', paperRoutes)
app.use('/api', sessionRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`server on http://localhost:${PORT}`);
});