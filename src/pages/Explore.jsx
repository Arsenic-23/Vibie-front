import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "https://vibie-backend.onrender.com/api";

// Utility function to fetch genres
const fetchGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genres/`);
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

// Utility function to fetch explore data by genre
const fetchExploreByGenre = async (genre) => {
  try {
    const response = await axios.get(`${BASE_URL}/explore/${genre}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching explore data for genre ${genre}:`, error);
    throw error;
  }
};

const ExplorePage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreData, setGenreData] = useState(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresList = await fetchGenres();
        setGenres(genresList);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    getGenres();
  }, []);

  useEffect(() => {
    const getExploreData = async () => {
      if (selectedGenre) {
        try {
          const data = await fetchExploreByGenre(selectedGenre);
          setGenreData(data);
        } catch (error) {
          console.error("Failed to fetch genre data:", error);
        }
      }
    };

    getExploreData();
  }, [selectedGenre]);

  return (
    <div className="p-4 pb-24">
      {/* Title Section */}
      <h1 className="text-4xl font-extrabold text-white mb-6">Explore Music</h1>

      {/* Genre Section */}
      <div className="mb-6">
        <h2 className="text-2xl text-white font-semibold mb-4">Genres</h2>
        <div className="flex flex-wrap gap-4">
          {genres.map((genre, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={() => setSelectedGenre(genre)}
            >
              <h3 className="text-xl text-white font-semibold">{genre}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Display Selected Genre's Songs */}
      {selectedGenre && genreData && (
        <div>
          <h3 className="text-2xl text-white font-semibold mb-4">
            Songs in {selectedGenre}
          </h3>

          {/* Top Songs */}
          <div>
            <h4 className="text-xl text-white mb-4">Top Songs</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genreData.top_songs.map((song, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md p-4 rounded-lg hover:scale-105 transform transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="rounded-lg w-full h-40 object-cover mb-3"
                  />
                  <div className="text-white text-sm font-semibold truncate">{song.title}</div>
                  <div className="text-gray-400 text-xs truncate">{song.artist}</div>
                </div>
              ))}
            </div>
          </div>

          {/* New Releases */}
          <div>
            <h4 className="text-xl text-white mb-4">New Releases</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genreData.new_releases.map((song, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md p-4 rounded-lg hover:scale-105 transform transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="rounded-lg w-full h-40 object-cover mb-3"
                  />
                  <div className="text-white text-sm font-semibold truncate">{song.title}</div>
                  <div className="text-gray-400 text-xs truncate">{song.artist}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!selectedGenre && <p className="text-white">Please select a genre to explore.</p>}
    </div>
  );
};

export default ExplorePage;