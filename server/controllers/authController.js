const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "2d";

const loginUser = async (req, res) => {
  try {
    const { clerkId, email, name, imageUrl } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Missing required user fields." });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId, email, name, imageUrl });
    } else {
      user.email = email;
      user.name = name;
      user.imageUrl = imageUrl;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, clerkId: user.clerkId },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        token,
        user: user.clerkId,
        message: "Login successful",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getDetails = async (req, res) => {
  const details = await User.find({ clerkId: req.clerkId });
  res.status(200).json(details);
};

module.exports = {
  loginUser,
  logoutUser,
  getDetails,
};
