const eventModel = require("../Models/eventModel");

const createevent = async (req, res) => {
  const { GameId, senderId, text } = req.body;

  const event = new eventModel({
    GameId,
    senderId,
    text,
  });

  try {
    const response = await event.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getevents = async (req, res) => {
  const { GameId } = req.params;

  try {
    const events = await eventModel.find({ GameId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createevent, getevents };
