import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Movies = () => {
  const { axios } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/shows/now-playing");
      if (data.success) {
        setMovies(data.movies);
      } else {
        setMovies([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching now playing movies:", err);
      setMovies([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-6 my-40 min-h-[80vh] px-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="w-[260px] h-[400px] bg-gray-900 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return movies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" right="50px" />
      <h1 className="text-2xl font-semibold mb-6 text-white">Now Showing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id || index} movie={movie} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center text-white">
        No Movies Available
      </h1>
    </div>
  );
};

export default Movies;
