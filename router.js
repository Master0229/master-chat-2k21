const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + '/template/login.html');
});

router.get("/full-emoji-list", (req, res) => {
  res.sendFile(__dirname + '/template/scripts/full-emoji-list.json');
});

module.exports = router;