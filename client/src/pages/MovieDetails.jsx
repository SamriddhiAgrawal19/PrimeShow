import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { StarIcon, Heart } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { dummyShowsData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [show, setShow] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);

  // ✅ Fetch movie + showtimes
  const fetchMovieDetails = async () => {
    try {
      const { data } = await axios.get(`/api/shows/${id}`);
      if (data.success) {
        setShow({
          movie: data.movie,
          dateTime: data.dateTime,
        });
      } else {
        setShow(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setShow(null);
      setLoading(false);
    }
  };

  // ✅ Safe date formatter
  const formatDate = (dateValue) => {
    if (!dateValue) return "Invalid date";
    try {
      const [year, month, day] = dateValue.split("T")[0].split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", dateValue, e);
      return "Invalid date";
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (loading) return <Loading />;
  if (!show)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Movie not found
      </div>
    );

  // Format dates and times
  const datesArray = Array.isArray(show.dateTime)
    ? show.dateTime.map((item) => ({
        ...item,
        formattedDate: formatDate(item.date),
        times: Array.isArray(item.times)
          ? item.times.map((s) => ({
              ...s,
              time: new Date(s.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          : [],
      }))
    : [];

  const recommendedMovies = showMore
    ? dummyShowsData
    : dummyShowsData.slice(0, 4);

  // ✅ Handle "Book Now"
  const handleBookNow = () => {
  if (selectedDateIndex !== null && datesArray[selectedDateIndex]) {
    const selectedDate = datesArray[selectedDateIndex].date;
    const firstAvailableTime =
      datesArray[selectedDateIndex].times?.[0]?.time || "00:00"; // fallback if no time

    navigate(`/movies/${id}/${selectedDate}/${firstAvailableTime}`);
  }
};

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-10 md:pt-20 mt-20 text-white">
      {/* Movie Details */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Poster */}
        <div className="relative">
          {show.movie?.poster_path ? (
            <img
              src={show.movie.poster_path}
              alt={show.movie.title}
              className="rounded-xl h-104 max-w-70 object-cover"
            />
          ) : (
            <div className="w-70 h-104 bg-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">No Poster</span>
            </div>
          )}
          <BlurCircle top="-100px" left="-100px" />
        </div>

        {/* Movie Info */}
        <div className="flex flex-col gap-4 relative">
          <p className="text-primary font-semibold">ENGLISH</p>
          <h1 className="text-4xl font-bold max-w-96">
            {show.movie?.title || "Untitled"}
          </h1>

          {/* Rating */}
          {show.movie?.vote_average && (
            <div className="flex items-center gap-2 text-gray-300">
              <StarIcon className="w-5 h-5 text-primary" />
              <span>{show.movie.vote_average.toFixed(1)}</span>
              <span>User Rating</span>
            </div>
          )}

          {/* Overview */}
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie?.overview || "No description available."}
          </p>

          {/* Runtime & Genre */}
          <p className="text-gray-300">
            {show.movie?.runtime ? timeFormat(show.movie.runtime) : "N/A"} •{" "}
            {show.movie?.release_date
              ? new Date(show.movie.release_date).getFullYear()
              : "----"}{" "}
            • {show.movie?.genres?.slice(0, 2).join(" | ") || "N/A"}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <div
              onClick={() => navigate(`/movies/${id}/trailer`)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-primary rounded-full text-black font-bold">
                ▶
              </div>
              <span className="font-medium">Watch Trailer</span>
            </div>

            <button
              onClick={handleBookNow}
              disabled={selectedDateIndex === null || selectedTimeIndex === null}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedDateIndex !== null && selectedTimeIndex !== null
                  ? "bg-primary hover:bg-primary-dull text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Book Now
            </button>

            <button className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <p className="text-gray-300 mt-8">Your Favourite Cast</p>
      <div className="flex gap-6 overflow-x-auto no-scrollbar mt-4 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {dummyShowsData.slice(0, 12).map((cast, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-center"
            >
              <img
                src={cast.poster_path}
                alt={cast.title}
                className="rounded-full h-20 aspect-square object-cover"
              />
              <p className="text-sm text-center">{cast.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div id="dateSelect" className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Select Date & Time</h2>
        {/* Dates */}
        <div className="flex flex-wrap gap-3 mb-4">
          {datesArray.map((dateObj, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedDateIndex(index);
                setSelectedTimeIndex(null); // reset time when changing date
              }}
              className={`px-4 py-2 rounded-md font-medium transition ${
                selectedDateIndex === index
                  ? "bg-primary text-black"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              }`}
            >
              {dateObj.formattedDate}
            </button>
          ))}
        </div>

        {/* Times */}
        {selectedDateIndex !== null && datesArray[selectedDateIndex]?.times.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {datesArray[selectedDateIndex].times.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelectedTimeIndex(i)}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  selectedTimeIndex === i
                    ? "bg-primary text-black"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                {t.time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Section */}
      <p className="text-lg font-medium mt-20 mb-4">You may also like</p>
      <div className="flex flex-wrap justify-start gap-4">
        {recommendedMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

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
