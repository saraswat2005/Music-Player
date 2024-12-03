import React, { useEffect, useLayoutEffect, useState } from "react";
import { Home, List, Music, Plus, Play } from "lucide-react";
import axios from "axios";
import Audio from "./audio";

// Mock Data (since we can't use axios)
let INITIAL_SONGS = [
  {
    _id: 1,
    name: "Bohemian Rhapsody",
    artist: "Queen",
    albumArt: "/api/placeholder/150/150",
  },
  {
    _id: 2,
    name: "Imagine",
    artist: "John Lennon",
    albumArt: "/api/placeholder/150/150",
  },
  {
    _id: 3,
    name: "Thriller",
    artist: "Michael Jackson",
    albumArt: "/api/placeholder/150/150",
  },
];

const INITIAL_PLAYLISTS = [
  {
    id: 1,
    name: "Classic Rock",
    songs: [
      {
        id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
      },
    ],
  },
];

// Main App Component
const MusicPlayerApp = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onDoubleClickSong={(song) => setCurrentSong(song)}
            songs={songs}
          />
        );
      case "playlists":
        return <PlaylistPage />;
      default:
        return <HomePage />;
    }
  };

  useEffect(() => {
    async function fetchSongs() {
      const URL = "http://localhost:8080";
      const data = await axios.get(URL + "/song");
      setSongs(data.data.songs);
    }
    fetchSongs();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {renderPage()}
      <BottomNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <Audio song={currentSong} />
    </div>
  );
};

// Home Page Component
const HomePage = ({ onDoubleClickSong, songs }) => {
  const [toggleForm, setToggleForm] = useState(false);
  return (
    <div className="p-4 flex-grow overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">All Songs</h1>
      <div className="grid grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 size-full"
            onDoubleClick={() => onDoubleClickSong(song)}
          >
            <img
              src={song.image}
              alt={song.name}
              className="w-full rounded-md mb-2 size-fit"
              style={{}}
            />
            <div className="text-center">
              <h3 className="font-semibold">{song.name}</h3>
              <p className="text-gray-600">{song.artist}</p>
            </div>
          </div>
        ))}
        <button
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={() => setToggleForm(true)}
        >
          Create Song
        </button>
      </div>
    </div>
  );
};

// Playlist Page Component
const PlaylistPage = () => {
  const [playlists] = useState(INITIAL_PLAYLISTS);
  const [availableSongs] = useState(INITIAL_SONGS);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleAddSongToPlaylist = (song) => {
    // Simulated playlist song addition
    if (selectedPlaylist) {
      // In a real app, this would be an API call
      selectedPlaylist.songs.push(song);
    }
  };

  return (
    <div className="p-4 flex-grow">
      <h1 className="text-2xl font-bold mb-4">Playlists</h1>
      <div className="grid grid-cols-2 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-100 p-3 rounded-lg cursor-pointer"
            onClick={() => setSelectedPlaylist(playlist)}
          >
            <h2 className="font-semibold">{playlist.name}</h2>
            <p>{playlist.songs.length} songs</p>
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">
            {selectedPlaylist.name} - Available Songs to Add
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {availableSongs
              .filter(
                (song) =>
                  !selectedPlaylist.songs.some((ps) => ps.id === song.id)
              )
              .map((song) => (
                <div
                  key={song.id}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{song.title}</h3>
                    <p className="text-gray-600">{song.artist}</p>
                  </div>
                  <button
                    onClick={() => handleAddSongToPlaylist(song)}
                    className="bg-blue-500 text-white p-2 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ currentPage, onPageChange }) => {
  return (
    <div className="bg-white border-t flex justify-around p-3">
      <button
        onClick={() => onPageChange("home")}
        className="flex flex-col items-center"
      >
        <Home size={24} color={currentPage === "home" ? "blue" : "black"} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button
        onClick={() => onPageChange("playlists")}
        className="flex flex-col items-center"
      >
        <List
          size={24}
          color={currentPage === "playlists" ? "blue" : "black"}
        />
        <span className="text-xs mt-1">Playlists</span>
      </button>
    </div>
  );
};

export default MusicPlayerApp;
