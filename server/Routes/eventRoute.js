const express = require("express");
const {
  createevent,
  getevents,
} = require("../Controllers/eventController");

const router = express.Router();

router.post("/", createevent);
router.get("/:GameId", getevents);

module.exports = router;
