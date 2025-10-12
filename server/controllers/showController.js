import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

// ------------------ NOW PLAYING ------------------
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });
    const movies = data.results;
    res.json({ success: true, movies: movies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ ADD SHOW ------------------
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !showsInput || !showPrice) {
      return res
        .status(400)
        .json({ message: "movieId, showsInput, and showPrice are required" });
    }

    // 1️⃣ Check if movie exists
    let movie = await Movie.findById(movieId);

    // 2️⃣ If movie doesn't exist, fetch from TMDB
    if (!movie) {
      try {
        // Fetch movie details
        const movieDetailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            timeout: 5000,
          }
        );
        const movieDetails = movieDetailsResponse.data;

        // Fetch movie credits
        const movieCreditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            timeout: 5000,
          }
        );
        const movieCredits = movieCreditsResponse.data.cast || [];

        // Create movie in DB with all required fields
        movie = await Movie.create({
          _id: movieId,
          title: movieDetails.title || "Unknown Title",
          overview: movieDetails.overview || "No overview",
          poster_path: movieDetails.poster_path || "dummy_poster.jpg",
          release_date: movieDetails.release_date || "2025-10-15",
          backdrop_path: movieDetails.backdrop_path || "dummy_backdrop.jpg",
          originalLanguage: movieDetails.original_language || "en",
          vote_average: movieDetails.vote_average || 0,
          runtime: movieDetails.runtime || 120,
          genres: movieDetails.genres || [],
          tagline: movieDetails.tagline || "No tagline",
          casts: movieCredits.map(c => ({
            id: c.id,
            name: c.name,
            character: c.character,
          })),
        });
      } catch (err) {
        console.error("TMDB fetch failed:", err.message);
        return res.status(500).json({
          message: "Failed to fetch movie from TMDB",
          error: err.message,
        });
      }
    }

    // 3️⃣ Prepare shows
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const [year, month, day] = show.date.split("-").map(Number);
      show.time.forEach((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const showDateTime = new Date(year, month - 1, day, hours, minutes); // local time
        showsToCreate.push({
          movie: movie._id,
          showDateTime,
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    // 4️⃣ Insert shows
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

// ------------------ GET ALL SHOWS ------------------
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    // Group shows by movie (each movie with all its showtimes)
    const groupedShows = {};
    shows.forEach((show) => {
      // ✅ Skip any show where movie is missing or not populated
      if (!show.movie || !show.movie._id) return;

      const movieId = show.movie._id.toString();

      if (!groupedShows[movieId]) {
        groupedShows[movieId] = {
          movie: show.movie, // full movie details
          shows: [],
        };
      }

      groupedShows[movieId].shows.push({
        showId: show._id,
        showDateTime: show.showDateTime,
        showPrice: show.showPrice,
        occupiedSeats: show.occupiedSeats,
      });
    });

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


// ------------------ GET SHOWS BY MOVIE ------------------
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })
      .sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Group shows by date
    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
        showPrice: show.showPrice,
        occupiedSeats: show.occupiedSeats,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (err) {
    console.error("getShow error:", err);
    res.status(500).json({
      message: "Failed to get show",
      error: err.message,
      stack: err.stack,
    });
  }
};
