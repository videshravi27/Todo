require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoute.js");
const taskRoute = require("./routes/taskRoute.js");
const connectDB = require("./utils/db.js");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/tasks", taskRoute);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB()
});
