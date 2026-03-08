const express = require("express");
const router = express.Router();
const { addUser } = require("../Controllers/userController");

router.post("/add-instructor", addUser);

module.exports = router;