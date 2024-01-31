const GameModel = require("../Models/gameModel");

const createGame = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    // check if a Game already exist
    const Game = await GameModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (Game) return res.status(200).json(Game);

    const newGame = new GameModel({
      members: [senderId, receiverId],
    });

    const response = await newGame.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const userGames = async (req, res) => {
  const userId = req.params.userId;

  try {
    const Games = await GameModel.find({
      members: { $in: [userId] },
    });

    res.status(200).json(Games);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findGame = async (req, res) => {
  const firstId = req.params.firstId;
  const secondId = req.params.secondId;

  try {
    const Game = await GameModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(Game);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createGame, userGames, findGame };
