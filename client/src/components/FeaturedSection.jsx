import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/shows/now-playing");
      if (data.success) {
        setMovies(data.movies.slice(0, 8)); // Limit to 8 movies
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

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 overflow-visible pt-20 bg-black text-white">
      {/* Header Row */}
      <div className="relative flex items-center justify-between pt-12 pb-6">
        <p className="text-gray-300 font-medium text-lg">Now Showing</p>
        <div className="relative flex items-center">
          <div className="absolute -top-10 -right-10 w-32 h-32 z-0 pointer-events-none">
            <BlurCircle />
          </div>
          <button
            onClick={() => navigate("/movies")}
            className="relative z-10 group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
          >
            View All
            <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-3 bg-gray-900 rounded-lg w-[260px] h-[400px] animate-pulse"
              />
            ))
          : movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
