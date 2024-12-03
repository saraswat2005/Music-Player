import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://example.com/api"; // Replace with your backend API URL

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/playlists" className="hover:underline">
            Playlists
          </Link>
        </nav>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
          </Routes>
        </div>
        <MusicPlayer />
      </div>
    </Router>
  );
}

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/songs`).then((response) => setSongs(response.data));
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    const event = new CustomEvent("playSong", { detail: song });
    window.dispatchEvent(event);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Songs</h1>
      <ul className="space-y-2">
        {songs.map((song) => (
          <li
            key={song.id}
            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-50"
            onDoubleClick={() => playSong(song)}
          >
            {song.name} - <span className="text-gray-500">{song.artist}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/playlists`)
      .then((response) => setPlaylists(response.data));
    axios.get(`${API_URL}/songs`).then((response) => setSongs(response.data));
  }, []);

  const addSongToPlaylist = (playlistId, songId) => {
    axios
      .post(`${API_URL}/playlists/${playlistId}/add`, { songId })
      .then(() => alert("Song added to playlist!"));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ul className="space-y-2">
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                {playlist.name}
              </li>
            ))}
          </ul>
        </div>
        {selectedPlaylist && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {selectedPlaylist.name}
            </h2>
            <h3 className="text-lg font-semibold">Add Songs:</h3>
            <ul className="space-y-2">
              {songs
                .filter(
                  (song) =>
                    !selectedPlaylist.songs.some((s) => s.id === song.id)
                )
                .map((song) => (
                  <li
                    key={song.id}
                    className="flex items-center justify-between"
                  >
                    <span>{song.name}</span>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() =>
                        addSongToPlaylist(selectedPlaylist.id, song.id)
                      }
                    >
                      Add
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const handlePlaySong = (event) => setCurrentSong(event.detail);
    window.addEventListener("playSong", handlePlaySong);
    return () => window.removeEventListener("playSong", handlePlaySong);
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 fixed bottom-0 w-full">
      {currentSong ? (
        <div className="flex items-center justify-between">
          <div>
            <p>Now Playing: {currentSong.name}</p>
          </div>
          <audio src={currentSong.url} controls autoPlay />
        </div>
      ) : (
        <p>No song playing</p>
      )}
    </div>
  );
}

export default App;
