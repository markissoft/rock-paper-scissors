const express = require("express");
const {
  createGame,
  userGames,
  findGame,
} = require("../Controllers/gameController");

const router = express.Router();

router.post("/", createGame);
router.get("/:userId", userGames);
router.get("/find/:firstId/:secondId", findGame);

module.exports = router;
