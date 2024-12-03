import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

// Default song object to prevent undefined errors
const DEFAULT_SONG = {
  title: "No Song Selected",
  artist: "Unknown",
  albumArt: "/api/placeholder/64/64",
  audioUrl: "",
};

const AudioPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Ensure we always have a valid song object
  const currentSong = song || DEFAULT_SONG;

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      const progressPercent =
        (audioElement.currentTime / audioElement.duration) * 100;
      setProgress(isNaN(progressPercent) ? 0 : progressPercent);
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentSong]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying && currentSong.file) {
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying, currentSong.file]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const audioElement = audioRef.current;

    if (!progressBar || !audioElement) return;

    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * audioElement.duration;

    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioElement.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isMuted) {
      audioElement.volume = volume;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-md mx-auto">
      {/* Song Info */}
      <div className="flex items-center mb-4">
        <img
          src={currentSong.image || "/api/placeholder/64/64"}
          alt={currentSong.name}
          className="w-16 h-16 rounded-md mr-4"
        />
        <div>
          <h3 className="font-bold text-lg">{currentSong.name}</h3>
          <p className="text-gray-600">{currentSong.artist}</p>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={currentSong.file} />

      {/* Progress Bar */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs text-gray-600">{formatTime(currentTime)}</span>
        <div
          ref={progressBarRef}
          className="flex-grow bg-gray-200 rounded-full h-1.5 cursor-pointer"
          onClick={handleProgressChange}
        >
          <div
            className="bg-blue-500 h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        {/* Previous Track */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <SkipBack size={24} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
          disabled={!currentSong.file}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        {/* Next Track */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="mt-4 flex items-center space-x-2">
        <button onClick={handleMuteToggle}>
          {isMuted ? (
            <VolumeX size={20} />
          ) : volume > 0.5 ? (
            <Volume2 size={20} />
          ) : (
            <Volume1 size={20} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-grow appearance-none bg-gray-200 h-1.5 rounded-full"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
