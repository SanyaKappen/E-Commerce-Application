const express = require("express");
const {
  signUpUser,
  signInUser,
  getUser,
} = require("../controllers/userController");
const { requireAuth } = require("../middleware/middleware");

const router = express.Router();

router.post("/register", signUpUser);
router.post("/login", signInUser);
router.get("/me", requireAuth, getUser);

module.exports = router;
