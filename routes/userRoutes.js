const express = require("express");
const {
  registerUser,
  loginAuth,
  updateProfile,
  getUser,
} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginAuth);
router.put("/update-profile", protect, updateProfile);
router.get("/", protect, getUser);

module.exports = router;
