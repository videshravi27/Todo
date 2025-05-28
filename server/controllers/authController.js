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
    if (user) {
      const token = jwt.sign(
        { id: user._id, clerkId: user.clerkId },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 2 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          token,
          user: {
            id: user._id,
            clerkId: user.clerkId,
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
          },
          message: "User already exists",
        });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      if (!emailExists.clerkId) {
        emailExists.clerkId = clerkId;
        await emailExists.save();

        const token = jwt.sign({ id: emailExists._id, clerkId }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        return res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 2 * 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({
            token,
            user: {
              id: emailExists._id,
              clerkId,
              email: emailExists.email,
              name: emailExists.name,
              imageUrl: emailExists.imageUrl,
            },
            message: "User updated with clerkId",
          });
      }

      return res
        .status(409)
        .json({ message: "Email already in use with a different account." });
    }

    const newUser = await User.create({ clerkId, email, name, imageUrl });
    const token = jwt.sign({ id: newUser._id, clerkId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        token,
        user: {
          id: newUser._id,
          clerkId,
          email: newUser.email,
          name: newUser.name,
          imageUrl: newUser.imageUrl,
        },
        message: "Login successful",
      });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Login failed" });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
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
