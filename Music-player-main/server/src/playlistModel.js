const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: String,
  items: [
    {
      name: String,
      genre: String,
      artist: String,
      file: String,
      image: String,
    },
  ],
});

module.exports = mongoose.model("playlist", playlistSchema);
