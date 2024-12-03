const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const connection =
  "mongodb+srv://krsna:LTR7wxfFfjzMUReV@cluster0.xsw77.mongodb.net/";

const songModel = require("./songModel");
const playlistModel = require("./playlistModel");
app.use("/songs", express.static("uploads"));
const URL = "http://localhost:8080/songs/";
mongoose
  .connect(connection)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error.message));

app.get("/song", async (req, res) => {
  const songs = await songModel.find();
  res.status(200).json({ songs });
});

app.post("/song", upload.single("song"), async (req, res) => {
  const { name, artist, genre, image } = req.body;
  const { filename } = req.file;

  const song = new songModel({
    name,
    artist,
    genre,
    file: URL + filename,
    image,
  });

  await song.save();

  res
    .status(200)
    .json({ message: "song uploaded successfully", song: URL + filename });
});

app.post("/playlist", async (req, res) => {
  const { name, items } = req.body;
  const playlist = new playlistModel({ name, items });
  await playlist.save();
  res.status(200).json({ message: "playlist created successfully" });
});

app.put("/playlist", async (req, res) => {
  const { name, artist, genre, file, image } = req.body;
  const playlist = playlistModel.findById(playlistId);
  playlist.items.push({ name, artist, genre, file, image });
  await playlist.save();
  res.status(200).json({ message: "song added succesfully" });
});

app.listen(8080);
