const express = require("express");
const { loginUser, logoutUser, getDetails } = require("../controllers/authController.js");
const { requireAuth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/details", requireAuth, getDetails);

module.exports = router;