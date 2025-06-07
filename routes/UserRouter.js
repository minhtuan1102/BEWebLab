const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  postUser,
  createUser,
} = require("../controllers/UserController.js");
router.post("/", postUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/createUser", createUser);

module.exports = router;
