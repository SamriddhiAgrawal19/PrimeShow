import { clerkClient } from "@clerk/express";
import Booking from "../models/bookings.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getUserBookings = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });

    // Manually attach movie details
    const bookingsWithMovie = await Promise.all(
      bookings.map(async (booking) => {
        const show = await Show.findById(booking.show);
        const movie = await Movie.findById(show.movieId).select("title poster_path runtime");
        return {
          ...booking.toObject(),
          show: {
            ...show.toObject(),
            movie
          }
        };
      })
    );

    res.json({ success: true, bookings: bookingsWithMovie });
  } catch (err) {
    console.error("getUserBookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const addFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favourites) {
      user.privateMetadata.favourites = [];
    }

    if (!user.privateMetadata.favourites.includes(movieId)) {
      user.privateMetadata.favourites.push(movieId);
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata
    });

    res.json({ success: true, message: "Favourites added successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateFavourite = async(req, res)=>{
    try{
        const {movieId} = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);
    if(!user.privateMetadata.favourites){
        user.privateMetadata.favourites = []
    }
    if(!user.privateMetadata.favourites.includes(movieId)){
        user.privateMetadata.favourites.push(movieId);
    }else{
        user.privateMetadata.favourites = user.privateMetadata.favourites.filter(item => item!== movieId);
    }
    await clerkClient.users.updateUserMetadata(userId , {privateMetaData})
    res.json({success : true , message : "Favourites updated successfully"});

    }catch(err){
        console.log(err.message);
    }
    

}

export const getFavourites = async(req, res) =>{
    try{
        const user = await clerkClient.users.getUser(req.auth().userId);
        const favourites = user.privateMetadata.favourites;

        const movies = await Movie.find({_id : {$in : favourites}})
        res.json({success : true , movies});

    }catch(err){
        console.log(err.message);
        res.json({success : false , message : err.message});
    }
}
export const removeFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favourites) {
      user.privateMetadata.favourites = [];
    }

    user.privateMetadata.favourites = user.privateMetadata.favourites.filter(
      (id) => id !== movieId
    );

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message: "Movie removed from favourites" });
  } catch (err) {
    console.error("removeFavourite error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
