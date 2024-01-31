const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");

const GameRoute = require("./Routes/GameRoute");
const eventRoute = require("./Routes/eventRoute");
const userRoute = require("./Routes/userRoute");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/Games", GameRoute);
app.use("/api/events", eventRoute);

app.get("/", (req, res) => {
  res.send("Welcome to our Game API...");
});

const uri = process.env.ATLAS_URI;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.event));
