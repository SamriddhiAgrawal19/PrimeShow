import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyShowsData, dummyDateTimeData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { StarIcon, Heart } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const getShow = async () => {
    const foundShow = dummyShowsData.find((show) => show._id === id);
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData,
      });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) return <Loading />;

  const recommendedMovies = showMore
    ? dummyShowsData
    : dummyShowsData.slice(0, 4); // show first 4, then expand all

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-10 md:pt-20 mt-20">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Poster */}
        <div className="relative">
          <img
            src={show.movie.poster_path}
            alt={show.movie.title}
            className="rounded-xl h-104 max-w-70 object-cover"
          />
          <BlurCircle top="-100px" left="-100px" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 relative">
          <p className="text-primary font-semibold">ENGLISH</p>

          <h1 className="text-4xl font-bold max-w-96 text-white">
            {show.movie.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary" />
            <span>{show.movie.vote_average.toFixed(1)}</span>
            <span>User Rating</span>
          </div>

          {/* Overview */}
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>

          {/* Runtime & Genre */}
          <p className="text-gray-300">
            {timeFormat(show.movie.runtime)} •{" "}
            {new Date(show.movie.release_date).getFullYear()} •{" "}
            {show.movie.genres
              ?.slice(0, 2)
              .map((genre) => genre.name)
              .join(" | ")}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-6">
            {/* Watch Trailer */}
            <div
              onClick={() => navigate(`/movies/${id}/trailer`)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full text-black font-bold">
                ▶
              </div>
              <span className="text-white font-medium">Watch Trailer</span>
            </div>

            {/* Buy Tickets */}
            <a href="#dateSelect" className="scroll-smooth">
              <button className="px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer">
                Buy Tickets
              </button>
            </a>

            {/* Heart Icon */}
            <button className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <p className="text-white-400 mt-8">Your Favourite Cast</p>
      <div className="flex gap-6 overflow-x-auto no-scrollbar mt-4 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-center"
            >
              <img
                src={cast.profile_path}
                alt={cast.name}
                className="rounded-full h-20 aspect-square object-cover"
              />
              <p className="text-sm text-center">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Select */}
      <DateSelect dateTime={show.dateTime} movieId={id} />

      {/* Recommended Section */}
      <p className="text-lg font-medium mt-20 mb-4">You may also like</p>
      <div className="flex flex-wrap justify-start gap-4">
        {recommendedMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {dummyShowsData.length > 4 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-6 py-2 bg-primary hover:bg-primary-dull rounded-md font-medium transition"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
