const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    GameId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const event = mongoose.model("event", eventSchema);

module.exports = event;
