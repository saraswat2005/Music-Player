const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: String,
  genre: String,
  artist: String,
  file: String,
  image: String,
});

module.exports = mongoose.model("song", songSchema);
