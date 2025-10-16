import React from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-lg hover:-translate-y-1 transition duration-300 w-[260px]">
      {/* Movie Poster */}
      <img
         onClick={() => {
    const movieId = movie._id;
    navigate(`/movie/${movieId}`);
    scrollTo(0, 0);
  }}
        className="rounded-lg h-56 w-full object-cover object-center cursor-pointer"
        src={movie.backdrop_path}
        alt={movie.title}
      />

      {/* Movie Title */}
      <p className="font-semibold mt-3 truncate text-white">{movie.title}</p>

      {/* Details */}
      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres?.slice(0, 2).map((genre) => genre.name).join(" | ")} •{" "}
        {timeFormat(movie.runtime)}
      </p>

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-4 pb-3">
        <button  onClick={() => {
           navigate(`/movie/${movie._id}`);
          scrollTo(0, 0);
        }} className="px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-300">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
