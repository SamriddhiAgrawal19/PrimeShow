import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import { CheckIcon, StarIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState(0);

  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  const formatVotes = (votes) => {
    if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
    return votes;
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;
    setDateTimeSelection((prev) => ({
      ...prev,
      [date]: prev[date] ? [...prev[date], time] : [time],
    }));
    setDateTimeInput("");
  };

  const handleRemoveDateTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const updatedTimes = prev[date].filter((t) => t !== time);
      if (updatedTimes.length === 0) {
        const { [date]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: updatedTimes };
    });
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return (
    <>
      <Title text1="Add" text2="Shows" />

      <p className="mt-10 text-lg font-medium text-white">Now Playing Movies</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 relative">
        {nowPlayingMovies.map((item, index) => (
          <div key={item._id || index} className="relative">
            <BlurCircle top="-10px" left="-10px" />
            <BlurCircle bottom="-10px" right="-10px" />

            <div
              className={`"w-60 rounded-xl overflow-hidden pb-3 bg-primary/5 border border-primary/40 hover:-translate-y-1 transition duration-300 shadow-sm hover:shadow-md relative" ${
                selectedMovie === (item._id || index) ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedMovie(item._id || index)}
            >
              <div className="relative">
                <img
                  src={item.poster_path}
                  alt={item.title}
                  className="w-full h-64 object-cover brightness-50 hover:brightness-100 transition-all duration-300"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/60 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-300">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {item.vote_average.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-gray-300">{formatVotes(item.vote_count)} Votes</p>
                </div>
              </div>

              {selectedMovie === (item._id || index) && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
              )}

              <p className="font-medium truncate mt-1 px-1 text-white">{item.title}</p>
              <p className="text-sm text-gray-300 px-1">{item.release_date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium mb-2 text-white">Show price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-white">{currency}</p>
          <input
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="bg-transparent border-none outline-none text-white placeholder:text-gray-500 w-24"
            placeholder="Enter show price"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-white">Select Date & Time</label>
        <div className="inline-flex gap-2 border border-gray-600 p-2 rounded-lg bg-black/30 relative">
          <BlurCircle top="-5px" left="-5px" />
          <BlurCircle bottom="-5px" right="-5px" />
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="bg-black/0 border border-gray-500 px-2 py-1 rounded-md text-white"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 rounded-md hover:brightness-90 transition"
          >
            Add Time
          </button>
        </div>
      </div>

      {selectedMovie && (
        <div className="mt-6 p-4 bg-black/40 rounded-md border border-gray-600 relative">
          <BlurCircle top="-10px" right="-10px" />
          <BlurCircle bottom="-10px" left="-10px" />

          <p className="text-white font-medium mb-2">
            <span className="text-gray-300">Selected Movie:</span>{" "}
            {nowPlayingMovies.find((m) => (m._id || nowPlayingMovies.indexOf(m)) === selectedMovie)?.title}
          </p>

          {Object.keys(dateTimeSelection).length > 0 && (
            <>
              <p className="text-white font-medium mb-1">Selected Dates & Time:</p>
              <ul className="mb-2">
                {Object.entries(dateTimeSelection).map(([date, times]) =>
                  times.map((time) => (
                    <li key={`${date}-${time}`} className="text-white text-sm">
                      {date} - {time}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}

          <p className="text-white font-medium mb-4">
            <span className="text-gray-300">Show Price:</span> {currency} {showPrice || 0}
          </p>

          <button className="bg-primary px-4 py-2 rounded-md text-white hover:brightness-90 transition">
            Add Show
          </button>
        </div>
      )}
    </>
  );
};

export default AddShows;