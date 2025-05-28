require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoute.js");
const taskRoute = require("./routes/taskRoute.js");
const connectDB = require("./utils/db.js");

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/tasks", taskRoute);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  connectDB();
});
