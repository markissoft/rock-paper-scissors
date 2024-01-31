const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

const GameModel = mongoose.model("Game", GameSchema);

module.exports = GameModel;
