import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

export const addMovie = async (req, res) => {
  try {
    const movieData = req.body;

    const existing = await Movie.findById(movieData._id);
    if (existing) {
      return res.status(400).json({ success: false, message: "Movie already exists" });
    }

    const movie = new Movie(movieData);
    await movie.save();

    res.json({ success: true, movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getNowPlayingMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ release_date: -1 });
    res.json({ success: true, movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !showsInput || !showPrice) {
      return res.status(400).json({ message: "movieId, showsInput, and showPrice are required" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found in DB. Please add it first." });
    }

    const showsToCreate = [];
    showsInput.forEach((show) => {
      const [year, month, day] = show.date.split("-").map(Number);
      show.time.forEach((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const showDateTime = new Date(year, month - 1, day, hours, minutes);
        showsToCreate.push({
          movieId : movie._id,
          showDateTime,
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    //console.log(showsToCreate);
    

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.status(201).json({ success: true, shows: showsToCreate });
  } catch (err) {
    console.error("addShow error:", err);
    res.status(500).json({
      message: "Failed to add shows",
      error: err.message,
      stack: err.stack,
    });
  }
};


export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().sort({ showDateTime: 1 });

    const groupedShows = {};

    for (const show of shows) {
      let movieData = null;

      // Try to populate movie, fallback if not found
      if (show.movieId) {
        movieData = await Movie.findById(show.movieId).lean();
      }

      const movieId = movieData?._id?.toString() || `unlinked-${show._id}`;

      if (!groupedShows[movieId]) {
        groupedShows[movieId] = {
          movie: movieData || { title: "Unknown Movie", _id: null },
          shows: [],
        };
      }

      groupedShows[movieId].shows.push({
        showId: show._id,
        showDateTime: show.showDateTime,
        showPrice: show.showPrice,
        occupiedSeats: show.occupiedSeats,
      });
    }

    res.json({ success: true, shows: Object.values(groupedShows) });
  } catch (err) {
    console.error("getShows error:", err);
    res.status(500).json({
      message: "Failed to get shows",
      error: err.message,
      stack: err.stack,
    });
  }
};

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Fetch upcoming shows
    const shows = await Show.find({
      movieId : movieId,
      showDateTime: { $gte: new Date() }
    })

    //.log(shows)

    // Fetch movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Group shows by date
    const datesArray = [];

    shows.forEach((show) => {
      // Ensure showDateTime is a Date object
      const showDate = new Date(show.showDateTime);


      const dateStr = showDate.toISOString().split("T")[0]; // YYYY-MM-DD

      let dateObj = datesArray.find((d) => d.date === dateStr);
      if (!dateObj) {
        dateObj = { date: dateStr, times: [] };
        datesArray.push(dateObj);
      }

      dateObj.times.push({
        time: showDate.toISOString(), // use ISO for now
        showId: show._id,
        showPrice: show.showPrice,
        occupiedSeats: show.occupiedSeats,
      });
    });

    console.log(datesArray);
    

    return res.json({ success: true, movie, dateTime: datesArray });
  } catch (error) {
    console.error("Error in getShow:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
